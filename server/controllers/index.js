import { User } from "../models/User.js";
import { logger } from "../utils/constants.js";
import bcrypt from "bcrypt";
import { matchedData, validationResult } from "express-validator";
import { Op } from "sequelize";
import { BookCollection } from "../models/BookCollection.js";
import Groq from "groq-sdk";
import { sequelize } from "../models/db.js";
import { TopicCategory } from "../models/TopicCategory.js";

const groq = new Groq({
  apiKey: process.env.GROQ_KEY,
});

const signup = async (req, res, next) => {
  try {
    const { email, password, firstname, lastname, username, DOB, gender } =
      req.body;

    logger.log("signup!!!!!!!!!!!!");
    // const result = validationResult(req)
    // if (!result.isEmpty()) {
    //     logger.log(result.array())
    //     throw new Error("Something went wrong");
    // }

    // const emailExist = await User.findOne({
    //     where: {
    //         email: email,
    //     }
    // })

    // const usernameExist = await User.findOne({
    //     where: {
    //         username: username,
    //     }
    // })

    // if (emailExist) {
    //     throw new Error("Email already exists");
    // }
    // if (usernameExist) {
    //     throw new Error("User already exists");
    // }

    const salt = await bcrypt.genSalt(10);
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
    req.login(newUser, function (err) {
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
  try {
    const { username, password } = req.body;

    const user = await User.findOne({
      where: {
        username: username,
      },
    });
    if (!user) {
      throw new Error("User not found");
    }
    if (!bcrypt.compareSync(password, user.password)) {
      throw new Error("Password is incorrect");
    }

    req.login(user, function (err) {
      if (err) {
        return next(err);
      }
      res.status(200).json({
        message: "User logged in successfully",
      });
    });
  } catch (error) {
    next(error);
  }
};

const bookCollection = async (req, res, next) => {
  try {
    const { q } = req.query;
    const { bookId } = req.params;
    let books;
    if (bookId) {
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
                  WHERE a.id = "${bookId}"
                  GROUP BY book_key`;
      const [results] = await sequelize.query(sql);
      books = results[0];
      if (books.author !== null) {
        const completion = await groq.chat.completions.create({
          model: "llama3-8b-8192",
          messages: [
            {
              role: "user",
              content: `Who is or are ${books.author}?
              This person/people has the following books: ${books.title}.
             Give your answer as formal as possible 
             because this will be used in an online book website.
             Answer about this person/people should be about their major, achievements
             and any other relevant information.
             Don't say anything like "Im happy to help" or "I hope this helps"
             at the beginning or end of your answer.`,
            },
          ],
        });
        books["author_info"] = completion.choices[0].message?.content;
      }
    } else {
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
      const [results] = await sequelize.query(sql);
      books = results;
    }

    logger.log(books);
    logger.log(q, bookId);
    res.status(200).json(books);
  } catch (error) {
    next(error);
  }
};

const getTopicCategories = async (req, res, next) => {
  try {
    let results = await TopicCategory.findAll();
    results = results.map((result) => result.toJSON());
    // logger.log(results);
    res.status(200).json(results);
  } catch (error) {
    next(error);
  }
};

export { signup, bookCollection, login, getTopicCategories };
