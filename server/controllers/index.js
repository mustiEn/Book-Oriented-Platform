import { matchedData, validationResult } from "express-validator";
import { User } from "../models/User.js";
import { logger, returnFromRaw } from "../utils/constants.js";
import bcrypt from "bcrypt";

const signup = async (req, res, next) => {
  //^ gets user data from the request body,
  //^ checks if the user already exists in the database,
  //^ hashes the password,creates a new user in the database,
  //^ and logs in the user

  try {
    const result = validationResult(req);
    const salt = await bcrypt.genSalt(10);

    if (!result.isEmpty()) {
      throw new Error(result.array()[0].msg);
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
      throw new Error(result.array()[0].msg);
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
    const result = validationResult(req);
    let data;

    if (!result.isEmpty()) {
      throw new Error(result.array()[0].msg);
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
                  WHERE a.id = ?
                  GROUP BY book_key`;

      data = await returnFromRaw(sql, [bookId]);

      if (data.length == 0) {
        throw new Error("Book not found");
      }
    } else {
      //& Gets 20 books from the database with the query

      const sql = `SELECT 
                      id, 
                      CASE WHEN MAX(
                        LENGTH(title)
                      ) > 100 THEN CONCAT(
                        SUBSTRING(
                          MAX(title), 
                          1, 
                          100
                        ), 
                        '...'
                      ) ELSE MAX(title) END AS truncatedTitle, 
                      MAX(title) AS title, 
                      MAX(thumbnail) AS thumbnail, 
                      GROUP_CONCAT(DISTINCT publisher SEPARATOR ', ') AS publishers, 
                      GROUP_CONCAT(DISTINCT author SEPARATOR ', ') AS authors, 
                      MAX(page_count) page_count 
                    FROM 
                      (
                        SELECT 
                          bo.id, 
                          bo.title AS title, 
                          bo.thumbnail AS thumbnail, 
                          au.author AS author, 
                          pu.publisher AS publisher, 
                          bo.page_count 
                        FROM 
                          book_collections AS bo 
                          LEFT JOIN author_book_association AS aubo ON aubo.bookId = bo.id 
                          LEFT JOIN publisher_book_association AS pubo ON pubo.bookId = bo.id 
                          JOIN AUTHORS AS au ON au.id = aubo.authorId 
                          JOIN publishers AS pu ON pu.id = pubo.publisherId 
                        WHERE 
                          bo.title LIKE ? 

                        UNION 

                        SELECT 
                          bo.id, 
                          bo.title AS title, 
                          bo.thumbnail AS thumbnail, 
                          au.author AS author, 
                          pu.publisher AS publisher, 
                          bo.page_count 
                        FROM 
                          author_book_association AS aubo 
                          LEFT JOIN book_collections AS bo ON aubo.bookId = bo.id 
                          LEFT JOIN publisher_book_association AS pubo ON pubo.bookId = bo.id 
                          JOIN AUTHORS AS au ON au.id = aubo.authorId 
                          JOIN publishers AS pu ON pu.id = pubo.publisherId 
                        WHERE 
                          au.author LIKE ? 

                        UNION 

                        SELECT 
                          bo.id, 
                          bo.title AS title, 
                          bo.thumbnail AS thumbnail, 
                          au.author AS author, 
                          pu.publisher AS publisher, 
                          bo.page_count 
                        FROM 
                          publisher_book_association AS pubo 
                          LEFT JOIN book_collections AS bo ON pubo.bookId = bo.id 
                          LEFT JOIN author_book_association AS aubo ON aubo.bookId = bo.id 
                          JOIN AUTHORS AS au ON au.id = aubo.authorId 
                          JOIN publishers AS pu ON pu.id = pubo.publisherId 
                        WHERE 
                          pu.publisher LIKE ?
                      ) AS df 
                    GROUP BY 
                      id 
                    LIMIT 
                      20`;

      data = await returnFromRaw(sql, [`%${q}%`, `%${q}%`, `%${q}%`]);
    }

    return res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};

export { signup, bookCollection, login };
