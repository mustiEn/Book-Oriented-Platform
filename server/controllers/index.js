import { matchedData, validationResult } from "express-validator";
import { User } from "../models/User.js";
import { logger, returnRawQuery } from "../utils/constants.js";
import bcrypt from "bcrypt";
import Groq from "groq-sdk";

const signup = async (req, res, next) => {
  //^ gets user data from the request body,
  //^ checks if the user already exists in the database,
  //^ hashes the password,creates a new user in the database,
  //^ and logs in the user

  try {
    const result = validationResult(req);
    const salt = await bcrypt.genSalt(10);

    logger.log("!");

    if (!result.isEmpty()) {
      throw new Error(result.array());
    }

    const { email, password, firstname, lastname, username, DOB, gender } =
      matchedData(req);
    const emailExist = await User.findOne({
      where: {
        email: email,
      },
    });
    const usernameExist = await User.findOne({
      where: {
        username: username,
      },
    });

    //& checks if email or username already exist

    if (emailExist) {
      throw new Error("Email already exists");
    }
    if (usernameExist) {
      throw new Error("Username already exists");
    }

    //& hashes the password using bcrypt and creates the user

    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = await User.create({
      username: username,
      firstname: firstname,
      lastname: lastname,
      email: email,
      password: hashedPassword,
      DOB: DOB,
      gender: gender,
    });

    //& returns and logs in the created user

    req.login(newUser, (err) => {
      if (err) {
        return next(err);
      }
      res.status(200).json({
        message: "User created successfully",
      });
    });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  //^ Gets username and password from the request body,
  //^ then checks if the user exists in the database.
  //^ If the user exists, it hashes the password and checks if it matches the stored hash.
  //^ If the password does not match, it returns error.
  //^ If the password matches, it logs the user in and returns a success message.

  try {
    const result = validationResult(req);

    if (!result.isEmpty()) {
      throw new Error(result.array());
    }

    const { username, password } = matchedData(req);
    const user = await User.findOne({
      where: {
        username: username,
      },
    });

    if (!user) {
      throw new Error("User not found");
    }
    if (!bcrypt.compareSync(password, user.password)) {
      //& Checks if the password matches the stored hash.

      throw new Error("Password is incorrect");
    }

    req.login(user, (err) => {
      if (err) {
        return next(err);
      }
      return res.status(200).json({
        message: "User logged in successfully",
      });
    });
  } catch (error) {
    next(error);
  }
};

const bookCollection = async (req, res, next) => {
  //^ Gets either bookId or query.
  //^ bookId is used to get a specific book,
  //^ while query is used to get 20 books based on the query

  try {
    const groq = new Groq({
      apiKey: process.env.GROQ_KEY,
    });
    const result = validationResult(req);
    let data;

    if (!result.isEmpty()) {
      throw new Error(result.array());
    }

    const { q, bookId } = matchedData(req);

    if (bookId) {
      //& Gets the book with the given bookId

      const sql = `SELECT a.*,
                  GROUP_CONCAT(DISTINCT c.author SEPARATOR ', ') AS author,
                  GROUP_CONCAT(DISTINCT e.publisher SEPARATOR ', ') AS publisher,
                  MAX(g.category) AS category,
                  MAX(i.description) AS descpription
                  FROM
                  book_collections a
                  INNER JOIN author_book_association b
                  ON b.bookId=a.id
                  LEFT JOIN AUTHORS c
                  ON b.authorId=c.id
                  INNER JOIN publisher_book_association d
                  ON d.bookId=a.id
                  LEFT JOIN publishers e
                  ON d.publisherId=e.id
                  INNER JOIN category_book_association f
                  ON f.bookId=a.id
                  LEFT JOIN categories g
                  ON f.categoryId=g.id
                  INNER JOIN description_book_association h
                  ON h.bookId=a.id
                  LEFT JOIN descriptions i
                  ON h.descriptionId=i.id
                  WHERE a.id = ${bookId}
                  GROUP BY book_key`;

      data = await returnRawQuery(sql);

      if (data.length == 0) {
        throw new Error("Book not found");
      }
      if (data[0].author !== null) {
        //& if author not null, gets some data related to author from groq

        const completion = await groq.chat.completions.create({
          model: "llama3-8b-8192",
          messages: [
            {
              role: "user",
              content: `Who is or are ${data[0].author}?
              This person/people has the following book: ${data[0].title}.
             Give your answer as formal as possible
             because this will be used in an online book website.
             Answer about this person/people should be about their major, achievements
             and any other relevant information.
             Don't say anything like "Im happy to help" or "I hope this helps"
             at the beginning or end of your answer.`,
            },
          ],
        });

        data[0]["author_info"] = completion.choices[0].message?.content;
      }
    } else {
      //& Gets 20 books from the database with the query

      const sql = `SELECT book_id,
                      MAX(book_key) AS book_key,
                      CASE WHEN MAX(LENGTH(title)) > 100
                        THEN CONCAT(SUBSTRING(MAX(title), 1, 100), '...')
                        ELSE MAX(title) END AS truncatedTitle,
                      MAX(title) AS title,
                      MAX(thumbnail) AS thumbnail,
                      GROUP_CONCAT(DISTINCT publisher SEPARATOR ', ') AS publishers,
                      GROUP_CONCAT(DISTINCT author SEPARATOR ', ') AS authors FROM
                      (SELECT bo.id AS book_id, bo.book_key AS book_key, bo.title AS title,
                      bo.thumbnail AS thumbnail,au.author AS author,
                      pu.publisher AS publisher
                      FROM book_collections AS bo
                      LEFT JOIN author_book_association AS aubo ON aubo.bookId=bo.id
                      LEFT JOIN publisher_book_association AS pubo ON pubo.bookId=bo.id
                      JOIN AUTHORS AS au ON au.id=aubo.authorId
                      JOIN publishers AS pu ON pu.id=pubo.publisherId
                      WHERE bo.title LIKE '%${q}%'

                      UNION

                      SELECT bo.id AS book_id, bo.book_key AS book_key, bo.title AS title,
                      bo.thumbnail AS thumbnail,au.author AS author,
                      pu.publisher AS publisher
                      FROM author_book_association AS aubo
                      LEFT JOIN book_collections AS bo ON aubo.bookId=bo.id
                      LEFT JOIN publisher_book_association AS pubo ON pubo.bookId=bo.id
                      JOIN AUTHORS AS au ON au.id=aubo.authorId
                      JOIN publishers AS pu ON pu.id=pubo.publisherId
                      WHERE au.author LIKE '%${q}%'

                      UNION

                      SELECT bo.id AS book_id, bo.book_key AS book_key, bo.title AS title,
                      bo.thumbnail AS thumbnail,au.author AS author,
                      pu.publisher AS publisher
                      FROM publisher_book_association AS pubo
                      LEFT JOIN book_collections AS bo ON pubo.bookId=bo.id
                      LEFT JOIN author_book_association AS aubo ON aubo.bookId=bo.id
                      JOIN AUTHORS AS au ON au.id=aubo.authorId
                      JOIN publishers AS pu ON pu.id=pubo.publisherId
                      WHERE pu.publisher LIKE '%${q}%') AS df
                      GROUP BY book_id
                      LIMIT 20
                      `;

      data = await returnRawQuery(sql);
    }

    return res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};

export { signup, bookCollection, login };
