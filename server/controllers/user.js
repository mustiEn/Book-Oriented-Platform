import { logger, returnRawQuery } from "../utils/constants.js";
import fs from "fs";
import { matchedData, validationResult } from "express-validator";
import { Op, QueryTypes, Sequelize } from "sequelize";
import { Review } from "../models/Review.js";
import { User } from "../models/User.js";
import moment from "moment";
import { sequelize } from "../models/db.js";
import { PrivateNote } from "../models/PrivateNote.js";
import { LikedBook } from "../models/LikedBook.js";
import { RatedBook } from "../models/RatedBook.js";
import { BookReadingState } from "../models/BookReadingState.js";
import { Post } from "../models/Post.js";
import { Comment } from "../models/Comment.js";
import { TopicCategory } from "../models/TopicCategory.js";
import { Topic } from "../models/Topic.js";
import { Thought } from "../models/Thought.js";
import { ThoughtImage } from "../models/ThoughtImage.js";
import { BookCollection } from "../models/BookCollection.js";
import { Quote } from "../models/Quote.js";
import { trendingTopics, trendingTopicsSql } from "../crons/index.js";
import { Transaction } from "../models/Transaction.js";
import { Category } from "../models/Category.js";
import FormData from "form-data";
import Stripe from "stripe";

import dotenv from "dotenv";
import { Subscription } from "../models/Subscription.js";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const endpointSecret = process.env.STRIPE_WEBHOOK_ENDPOINT_SECRET;
dotenv.config();

const shareReview = async (req, res, next) => {
  try {
    const { review, title, bookId } = req.body;
    const result = validationResult(req);

    if (!result.isEmpty()) {
      logger.log(result.array());
      return res.status(400).json({ error: result.array() });
    }

    const { topic: topicName } = matchedData(req);
    const topic = await Topic.findOne({
      where: {
        topic: topicName,
      },
    });

    if (!topic) {
      throw new Error("Topic not found");
    }

    const reviewRecord = await Review.create({
      title,
      review,
      topicId: topic.id,
      bookId,
      userId: req.session.passport.user,
    });
    logger.log(reviewRecord);
    res.status(200).json({
      message: "Review added successfully",
    });
  } catch (error) {
    next(error);
  }
};

// !!!!!! change
const getBookReviews = async (req, res, next) => {
  try {
    const { bookId } = req.params;
    const totalRatingSql = `SELECT ROUND(AVG(rating),1) AS rate,
                        COUNT(*) AS total_people_rated
                        FROM rated_books
                        WHERE bookId=52
                        `;
    const reviewsSql = `SELECT d.id,userId,e.username,e.firstname,e.lastname,
                        e.profile_photo,bookId,rating,title,review,created_at,
                        reading_state,page_number,topic
                        FROM users e
                        INNER JOIN (SELECT MAX(a.id) AS id,MAX(a.userId) AS userId,
                        MAX(a.rating) AS rating,
                        MAX(reviewBookId) AS bookId,
                        MAX(title) AS title,MAX(review) AS review,
                        MAX(created_at) AS created_at,
                        MAX(c.reading_state) AS reading_state,
                        MAX(c.page_number) AS page_number,MAX(topic) AS topic
                        FROM rated_books a
                        INNER JOIN (SELECT r.userId,r.title AS title,r.bookId AS reviewBookId,
                        r.review AS review, r.createdAt AS created_at, t.topic AS topic
                        FROM reviews r
                        LEFT JOIN topics t
                        ON t.id=r.topicId
                        WHERE bookId=${bookId}) b
                        ON a.userId=b.userId
                        LEFT JOIN book_reading_states c
                        ON c.userId=b.userId
                        WHERE c.bookId=${bookId}
                        GROUP BY a.userId) d
                        ON e.id=d.userId`;
    const ratingsSql = `SELECT rating,bookId,COUNT(rating) AS total
                        FROM rated_books
                        WHERE bookId=${bookId}
                        GROUP BY rating`;
    let [reviews, ratings, totalRating] = await Promise.all([
      sequelize.query(reviewsSql, { type: QueryTypes.SELECT }),
      sequelize.query(ratingsSql, { type: QueryTypes.SELECT }),
      sequelize.query(totalRatingSql, { type: QueryTypes.SELECT }),
    ]);
    let ratingsMap = new Map();
    for (const element of ratings) {
      ratingsMap.set(element.rating, element.total);
    }

    ratingsMap = Object.fromEntries(ratingsMap);
    res.status(200).json({ reviews, ratingsMap, totalRating });
  } catch (error) {
    next(error);
  }
};

const setPrivateNote = async (req, res, next) => {
  try {
    const { privateNote } = req.body;
    const { bookId } = req.params;
    const userId = req.session.passport.user;

    const userPrivateNote = await PrivateNote.findOne({
      where: {
        bookId: bookId,
        userId: userId,
      },
    });

    if (userPrivateNote) {
      await PrivateNote.update(
        {
          private_note: privateNote,
        },
        {
          where: {
            bookId: bookId,
            userId: userId,
          },
        }
      );
    } else {
      await PrivateNote.create({
        bookId: bookId,
        userId: userId,
        private_note: privateNote,
      });
    }

    res.status(200).json({
      message: "Private note added successfully",
    });
  } catch (error) {
    next(error);
  }
};

const setReadingState = async (req, res, next) => {
  try {
    const { readingState } = req.body;
    const { bookId } = req.params;
    const userId = req.session.passport.user;

    logger.log(readingState);

    const userReadingState = await BookReadingState.findOne({
      where: {
        bookId: bookId,
        userId: userId,
      },
    });

    if (userReadingState) {
      await BookReadingState.update(
        {
          reading_state: readingState,
        },
        {
          where: {
            bookId: bookId,
            userId: userId,
          },
          individualHooks: true,
        }
      );
    } else {
      await BookReadingState.create(
        {
          bookId: bookId,
          userId: userId,
          reading_state: readingState,
        },
        {
          individualHooks: true,
        }
      );
    }

    res.status(200).json({
      message: "Reading state added successfully",
    });
  } catch (error) {
    next(error);
  }
};

const setBookLiked = async (req, res, next) => {
  try {
    const { isBookLiked } = req.body;
    const { bookId } = req.params;
    const userId = req.session.passport.user;

    const userLikedBook = await LikedBook.findOne({
      where: {
        bookId: bookId,
        userId: userId,
      },
    });

    if (userLikedBook) {
      await LikedBook.update(
        {
          is_liked: isBookLiked,
        },
        {
          where: {
            bookId: bookId,
            userId: userId,
          },
        }
      );
    } else {
      await LikedBook.create({
        bookId: bookId,
        userId: userId,
        is_liked: isBookLiked,
      });
    }

    res.status(200).json({
      message: "You liked the book",
    });
  } catch (error) {
    next(error);
  }
};

const setBookRate = async (req, res, next) => {
  try {
    const { rate } = req.body;
    const { bookId } = req.params;
    const userId = req.session.passport.user;

    logger.log(rate);
    const userRatedBook = await RatedBook.findOne({
      where: {
        bookId: bookId,
        userId: userId,
      },
    });

    if (userRatedBook) {
      await RatedBook.update(
        {
          rating: rate,
        },
        {
          where: {
            bookId: bookId,
            userId: userId,
          },
        }
      );
    } else {
      await RatedBook.create({
        bookId: bookId,
        userId: userId,
        rating: rate,
      });
    }

    res.status(200).json({
      message: "You rated the book",
    });
  } catch (error) {
    next(error);
  }
};

const getReaderBookDetailsAndHeader = async (req, res, next) => {
  try {
    const { bookId } = req.params;
    const userId = req.session.passport.user;
    const readerBookRecordSql = `SELECT a.userId,a.bookId,MAX(a.reading_state) reading_state,
                                MAX(a.page_number) page_number,
                                MAX(DATE(starting_date)) starting_date,MAX(DATE(finishing_date)) finishing_date,
                                MAX(b.is_liked) is_liked,MAX(c.private_note) private_note,MAX(d.rating) rating
                                FROM book_reading_states a
                                LEFT JOIN liked_books b
                                ON a.userId = b.userId
                                LEFT JOIN private_notes c
                                ON a.userId = c.userId
                                LEFT JOIN rated_books d
                                ON a.userId = d.userId
                                WHERE a.bookId=${bookId}
                                AND a.userId=${userId}`;
    const [readerBookRecord] = await sequelize.query(readerBookRecordSql, {
      type: QueryTypes.SELECT,
    });

    readerBookRecord.rating =
      readerBookRecord.rating == null ? 0 : readerBookRecord.rating;
    readerBookRecord.is_liked =
      readerBookRecord.is_liked == null ? false : readerBookRecord.is_liked;

    logger.log(readerBookRecord);
    res.status(200).json(readerBookRecord);
  } catch (error) {
    next(error);
  }
};

const setUserBookRecord = async (req, res, next) => {
  try {
    const { bookId } = req.params;
    const userId = req.session.passport.user;

    const userBookInteraction = await LikedBook.findOne({
      where: {
        bookId: bookId,
        userId: userId,
      },
    });

    if (!userBookInteraction) {
      await LikedBook.create({
        bookId: bookId,
        userId: userId,
        is_liked: false,
      });
      await PrivateNote.create({
        bookId: bookId,
        userId: userId,
        private_note: null,
      });
      await BookReadingState.create({
        bookId: bookId,
        userId: userId,
        reading_state: null,
      });

      await RatedBook.create({
        bookId: bookId,
        userId: userId,
        rating: null,
      });
    }

    res.status(200).json({
      message: "Success",
    });
  } catch (error) {
    next(error);
  }
};

const getBookStatistics = async (req, res, next) => {
  try {
    const { bookId } = req.params;
    const readerAgeRange = {};
    const ageRangeArr = [
      [0, 18],
      [18, 24],
      [25, 34],
      [35, 44],
      [45, 54],
      [55, 64],
      [65],
    ];
    const readersSql = `SELECT a.id,TIMESTAMPDIFF(YEAR,DOB,CURDATE()) AS age
                        FROM users a
                        INNER JOIN book_reading_states b
                        ON a.id=b.userId
                        WHERE reading_state IS NOT NULL
                        and b.bookId=${bookId};`;
    const bookStatisticsSql = `SELECT *, ROUND((male*100)/(male+female),1) AS male_percentage,
                            ROUND((female*100)/(male+female),1) AS female_percentage
                            FROM (SELECT COUNT(reading_state) AS read_
                            FROM book_reading_states
                            WHERE reading_state="Read"
                            AND bookId=${bookId}) a
                            CROSS JOIN
                            (SELECT COUNT(reading_state) AS currently_reading
                            FROM book_reading_states
                            WHERE reading_state="Currently reading"
                            AND bookId=${bookId})  b
                            CROSS JOIN
                            (SELECT COUNT(reading_state) AS want_to_read
                            FROM book_reading_states
                            WHERE reading_state="Want to read"
                            AND bookId=${bookId})  c
                            CROSS JOIN
                            (SELECT COUNT(reading_state) AS did_not_finish
                            FROM book_reading_states
                            WHERE reading_state="Did not finish"
                            AND bookId=${bookId})  d
                            CROSS JOIN
                            (SELECT COUNT(*) AS reviews
                            FROM reviews
                            WHERE bookId=${bookId}) e
                            CROSS JOIN
                            (SELECT ROUND(AVG(rating),1) AS rate
                            FROM rated_books
                            WHERE bookId=${bookId}) f
                            CROSS JOIN
                            (SELECT COUNT(*) AS people_rated
                            FROM rated_books
                            WHERE bookId=${bookId}
                            AND rating IS NOT NULL) g
                            CROSS JOIN
                            (SELECT COUNT(*) AS likes
                            FROM liked_books
                            WHERE bookId=${bookId}
                            AND is_liked=1) h
                            CROSS JOIN
                            (SELECT COUNT(*) AS views
                            FROM liked_books
                            WHERE bookId=${bookId}) i
                            CROSS JOIN
                            (SELECT 
                            COUNT(CASE WHEN gender = 'Male' THEN 1 END) AS male,
                            COUNT(CASE WHEN gender = 'Female' THEN 1 END) AS female
                            FROM (SELECT u.id,u.username,u.gender AS gender,b.reading_state
                            FROM users u
                            LEFT JOIN
                            book_reading_states b
                            ON b.userId=u.id
                            WHERE b.reading_state IS NOT NULL
                            AND bookId=${bookId}) t) j`;

    const [readers, bookStatistics] = await Promise.all([
      sequelize.query(readersSql, {
        type: QueryTypes.SELECT,
      }),
      sequelize.query(bookStatisticsSql, {
        type: QueryTypes.SELECT,
      }),
    ]);

    for (const x of ageRangeArr) {
      if (x[0] !== 65) {
        readerAgeRange[`${x[0]}-${x[1]}`] = readers.filter(
          (data) => data.age >= x[0] && data.age <= x[1]
        ).length;
      } else {
        readerAgeRange["65+"] = readers.filter((data) => data.age >= 65).length;
      }
    }

    res.status(200).json({
      bookStatistics: bookStatistics[0],
      readerAgeRange: readerAgeRange,
    });
  } catch (error) {
    next(error);
  }
};

const getReaderProfiles = async (req, res, next) => {
  try {
    const { bookId } = req.params;
    let { q } = req.query;
    q = q.replaceAll("-", " ");
    logger.log(q);
    logger.log(bookId);
    let readerProfilesSql;

    if (q !== "Liked") {
      readerProfilesSql = `SELECT userId,a.username,a.firstname,a.lastname
                          ,a.profile_photo,book_read 
                          FROM users a 
                          INNER JOIN (SELECT userId,COUNT(CASE WHEN reading_state="Read" THEN 1 END) AS book_read
                          FROM book_reading_states
                          WHERE userId IN (SELECT userId
                          FROM book_reading_states
                          WHERE reading_state="${q}"
                          AND bookId=${bookId})
                          GROUP BY userId) b
                          ON b.userId=a.id`;
    } else {
      readerProfilesSql = `SELECT a.userId,c.username,c.firstname,
                            c.lastname,c.profile_photo,
                            COUNT(CASE WHEN reading_state="Read" THEN 1 END) AS book_read
                            FROM (SELECT *
                            FROM liked_books
                            WHERE is_liked = 1
                            AND bookId = ${bookId}) a
                            LEFT JOIN book_reading_states b
                            ON b.userId=a.userId
                            INNER JOIN users c
                            ON c.id=a.userId
                            GROUP BY a.userId `;
    }

    const readerProfiles = await sequelize.query(readerProfilesSql, {
      type: QueryTypes.SELECT,
    });
    logger.log(readerProfiles);
    res.status(200).json({
      readerProfiles,
    });
  } catch (error) {
    next(error);
  }
};

const displayReaderProfile = async (req, res, next) => {
  try {
    const { username } = req.params;
    const reader = await User.findOne({
      attributes: {
        exclude: ["password", "updatedAt", "email"],
      },
      where: {
        username: username,
      },
    });
    res.status(200).json(reader);
  } catch (error) {
    next(error);
  }
};

const filterReaderBooks = async (req, res, next) => {
  try {
    const { q, sort, category, author, year } = req.query;
    const userId = req.session.passport.user;
    const querySortDict = {
      1: ["title", "ASC"],
      2: ["published_date", "DESC"],
      3: ["page_count", "DESC"],
    };
    const defineWhereClause = (condition, userId, category, author, year) => {
      let where = `WHERE ${condition}
               AND a.userId=${userId}`;
      return category != undefined
        ? (where += ` AND h.category= "${category}"`)
        : author != undefined
        ? (where += ` AND d.author= "${author}"`)
        : year != undefined && year != "All times"
        ? (where += ` AND YEAR(a.createdAt)= "${year}"`)
        : where;
    };
    const defineOrderByClause = (sort) => {
      return sort != undefined
        ? `ORDER BY f.${querySortDict[sort][0]} ${querySortDict[sort][1]}`
        : "";
    };
    const returnReaderBooks = (table, where) => {
      return `SELECT f.id,a.userId AS userId,
                MAX(f.book_key) AS book_key,  
                CASE WHEN MAX(LENGTH(f.title)) > 100
                THEN CONCAT(SUBSTRING(MAX(f.title), 1, 100), '...')
                ELSE MAX(f.title) END AS truncatedTitle,
                MAX(f.title) AS title,        
                MAX(f.thumbnail) AS thumbnail,
                GROUP_CONCAT(DISTINCT e.publisher SEPARATOR ', ') AS publishers, 
                MAX(c.publisherId) AS publisher_id,
                GROUP_CONCAT(DISTINCT d.author SEPARATOR ', ') AS authors
                FROM ${table} a
                INNER JOIN author_book_association b
                ON b.bookId=a.bookId
                INNER JOIN publisher_book_association c
                ON c.bookId=a.bookId
                INNER JOIN AUTHORS d
                ON d.id=b.authorId
                INNER JOIN publishers e
                ON e.id=c.publisherId
                INNER JOIN category_book_association g
                ON g.bookId=a.bookId
                INNER JOIN categories h
                ON h.id=g.categoryId
                INNER JOIN book_collections f
                ON f.id=a.bookId
                ${defineWhereClause(where, userId, category, author, year)}
                GROUP BY f.id
                ${defineOrderByClause(sort)}
                `;
    };
    const returnBooksPerCategory = (table, where, userId) => {
      return `SELECT MAX(c.id) AS categoryId,MAX(a.bookId) AS bookId,
            MAX(c.category) AS category,
            COUNT(c.id) AS "quantity"
            FROM (SELECT bookId AS bookId
            FROM ${table} 
            WHERE ${where}
            AND userId=${userId}) a
            INNER JOIN category_book_association b
            ON a.bookId=b.bookId
            INNER JOIN categories c
            ON c.id=b.categoryId
            GROUP BY c.id `;
    };
    const returnBooksPerAuthor = (table, where, userId) => {
      return `SELECT MAX(c.id) AS authorId,MAX(a.bookId) AS bookId,
            MAX(c.author) AS author,
            COUNT(c.id) AS "quantity"
            FROM (SELECT bookId AS bookId
            FROM ${table} 
            WHERE ${where}
            AND userId=${userId}) a
            INNER JOIN author_book_association b
            ON a.bookId=b.bookId
            INNER JOIN AUTHORS c
            ON c.id=b.authorId
            GROUP BY c.id`;
    };
    const returnBookRatings = () => {
      return `SELECT te.id,ROUND(AVG(rating),1) AS rating,
              MAX(b.rating) AS user_rating
              FROM (
              ${returnReaderBooks("liked_books", "is_liked = '1'")}            
              ) te
              LEFT JOIN rated_books b
              ON b.bookId = te.id
              GROUP BY te.id
              `;
    };
    const readerBooksMerged = [];

    let booksPerAuthorSql, booksPerCategorySql, readerBooksSql, bookRatingsSql;
    logger.log(req.query);

    logger.log(q);
    logger.log(sort);
    logger.log(category);
    logger.log(author);
    logger.log(year);

    if (q == "Liked") {
      readerBooksSql = returnReaderBooks("liked_books", "is_liked = '1'");
      booksPerAuthorSql = returnBooksPerAuthor(
        "liked_books",
        "is_liked = '1'",
        userId
      );
      booksPerCategorySql = returnBooksPerCategory(
        "liked_books",
        "is_liked = '1'",
        userId
      );
      bookRatingsSql = returnBookRatings();
    } else {
      readerBooksSql = returnReaderBooks(
        "book_reading_states",
        `reading_state = "${q}"`
      );
      bookRatingsSql = returnBookRatings();
      booksPerAuthorSql = returnBooksPerAuthor(
        "book_reading_states",
        `reading_state = "${q}"`,
        userId
      );
      booksPerCategorySql = returnBooksPerCategory(
        "book_reading_states",
        `reading_state = "${q}"`,
        userId
      );
    }

    const [readerBooks, booksPerAuthor, booksPerCategory, bookRatings] =
      await Promise.all([
        returnRawQuery(readerBooksSql),
        returnRawQuery(booksPerAuthorSql),
        returnRawQuery(booksPerCategorySql),
        returnRawQuery(bookRatingsSql),
      ]);

    if (readerBooks.length != 0) {
      const bookRatingsMap = new Map(
        bookRatings.map((item) => [
          item.id,
          { overall_rating: item.rating, reader_rating: item.user_rating },
        ])
      );

      for (let x of readerBooks) {
        readerBooksMerged.push({ ...x, ...bookRatingsMap.get(x.id) });
      }
    }
    res.status(200).json({
      booksPerAuthor,
      booksPerCategory,
      readerBooksMerged,
    });
  } catch (error) {
    next(error);
  }
};

const getReaderReviews = async (req, res, next) => {
  try {
    const { username } = req.params;
    const user = await User.findOne({
      where: {
        username: username,
      },
    });
    logger.log(user.toJSON());
    if (!user) {
      throw new Error("User not found");
    }
    const reviewsSql = `SELECT 
                        r.id, 
                        r.bookId, 
                        u.username, 
                        u.firstname, 
                        u.lastname, 
                        r.title, 
                        r.review, 
                        p.comment_count, 
                        #people_read,
                        rb.rating,
                        lb.is_liked,
                        brs.reading_state, 
                        r.topicId, 
                        t.topic, 
	                      t.image topic_image,   
                        truncated_title, 
                        publishers, 
                        authors_, 
                        thumbnail, 
                        published_date, 
                        r.createdAt 
                      FROM 
                        reviews r 
                        INNER JOIN (
                          SELECT 
                            r.bookId AS bcId, 
                            #bc.people_read AS people_read, 
                            CASE WHEN MAX(
                              LENGTH(bc.title)
                            ) > 100 THEN CONCAT(
                              SUBSTRING(
                                MAX(bc.title), 
                                1, 
                                100
                              ), 
                              '...'
                            ) ELSE MAX(bc.title) END AS truncated_title, 
                            GROUP_CONCAT(
                              DISTINCT pu.publisher SEPARATOR ', '
                            ) AS publishers, 
                            GROUP_CONCAT(DISTINCT au.author SEPARATOR ', ') AS authors_, 
                            bc.thumbnail AS thumbnail, 
                            bc.published_date AS published_date
                          FROM 
                            reviews r 
                            LEFT JOIN book_collections bc ON r.bookId = bc.id 
                            LEFT JOIN publisher_book_association pubo ON pubo.bookId = r.bookId 
                            JOIN publishers pu ON pu.id = pubo.publisherId 
                            LEFT JOIN author_book_association aubo ON aubo.bookId = r.bookId 
                            INNER JOIN AUTHORS au ON au.id = aubo.authorId 
                             
                          WHERE 
                            r.userId = ${user.toJSON().id} 
                          GROUP BY 
                            r.bookId
                        ) temp2 ON temp2.bcId = r.bookId 
                        AND r.userId = ${user.toJSON().id}
                        LEFT JOIN rated_books rb ON rb.bookId = r.bookId
                        AND rb.userId = r.userId
                        LEFT JOIN book_reading_states brs ON brs.bookId = r.bookId
                        AND brs.userId = r.userId
                        LEFT JOIN topics t ON t.id = r.topicId
                        LEFT JOIN liked_books lb ON lb.bookId = r.bookId
                        AND lb.userId = r.userId 
                        INNER JOIN posts p ON p.postId = r.id
                        and p.post_type = "review" 
                        INNER JOIN users u ON u.id = r.userId
                        `;

    const readerReviews = await returnRawQuery(reviewsSql);
    logger.log(readerReviews);
    res.status(200).json({
      readerReviews,
    });
  } catch (error) {
    next(error);
  }
};

const getReaderQuotes = async (req, res, next) => {
  try {
    const { username } = req.params;
    const userId = req.session.passport.user;
    const user = await User.findOne({
      where: {
        username: username,
      },
    });
    logger.log(user.toJSON());
    if (!user) {
      throw new Error("User not found");
    }
    const quotesSql = `SELECT 
                        q.id, 
                        q.bookId, 
                        u.username, 
                        u.firstname, 
                        u.lastname, 
                        q.title, 
                        q.quote,
                        q.page, 
                        p.comment_count, 
                        people_read, 
                        q.topicId, 
                        topic, 
                        topic_image, 
                        truncated_title, 
                        publishers, 
                        authors_, 
                        thumbnail, 
                        published_date, 
                        q.createdAt 
                        FROM 
                        quotes q 
                        INNER JOIN (
                          SELECT 
                          q.bookId AS bcId, 
                          bc.people_read AS people_read, 
                          CASE WHEN MAX(
                            LENGTH(bc.title)
                          ) > 100 THEN CONCAT(
                            SUBSTRING(
                            MAX(bc.title), 
                            1, 
                            100
                            ), 
                            '...'
                          ) ELSE MAX(bc.title) END AS truncated_title, 
                          GROUP_CONCAT(
                            DISTINCT pu.publisher SEPARATOR ', '
                          ) AS publishers, 
                          GROUP_CONCAT(DISTINCT au.author SEPARATOR ', ') AS authors_, 
                          bc.thumbnail AS thumbnail, 
                          bc.published_date AS published_date, 
                          MAX(t.topic) AS topic, 
                          MAX(t.image) AS topic_image 
                          FROM 
                          quotes q
                          LEFT JOIN book_collections bc ON q.bookId = bc.id 
                          LEFT JOIN publisher_book_association pubo ON pubo.bookId = q.bookId 
                          JOIN publishers pu ON pu.id = pubo.publisherId 
                          LEFT JOIN author_book_association aubo ON aubo.bookId = q.bookId 
                          INNER JOIN AUTHORS au ON au.id = aubo.authorId 
                          LEFT JOIN topics t ON t.id = q.topicId 
                          WHERE 
                          q.userId = ${userId} 
                          GROUP BY 
                          q.bookId
                        ) temp2 ON temp2.bcId = q.bookId 
                        AND q.userId = ${userId}
                        INNER JOIN posts p ON p.postId = q.id
                        AND p.post_type = "quote" 
                        INNER JOIN users u ON u.id = q.userId
                        `;

    const readerQuotes = await returnRawQuery(quotesSql);
    logger.log(readerQuotes);
    res.status(200).json({
      readerQuotes,
    });
  } catch (error) {
    next(error);
  }
};

const getReaderThoughts = async (req, res, next) => {
  const { username } = req.params;
  let thoughtsMerged;
  const userId = req.session.passport.user;
  const user = await User.findOne({
    where: {
      username: username,
    },
  });
  logger.log(user.toJSON());
  if (!user) {
    throw new Error("User not found");
  }
  const thoughtsSql = `SELECT 
                          MAX(t.id) id,
                          MAX(t.title) title,
                          MAX(t.thought) thought,
                          JSON_ARRAYAGG(ti.image) images,
                          MAX(p.comment_count) comment_count,
                          MAX(bc.title) title,
                          CASE 
                              WHEN LENGTH(MAX(bc.title)) > 80 
                              THEN CONCAT(SUBSTRING(MAX(bc.title), 1, 80), '...') 
                              ELSE MAX(bc.title) 
                          END AS truncated_title,
                          MAX(top.topic) topic,
                          MAX(top.image) AS topic_image,
                          u.username,
                          u.firstname,
                          u.lastname,
                          u.profile_photo
                      FROM 
                          thoughts t
                      JOIN 
                          thought_images ti ON t.id = ti.thoughtId
                      JOIN 
                          book_collections bc ON t.bookId = bc.id
                      JOIN 
                          topics top ON t.topicId = top.id
                      JOIN 
                          users u ON t.userId = u.id
                      JOIN
                        posts p ON p.postId = t.id
                        AND p.post_type = "thought"
                      WHERE 
                          u.id = ${userId};`;
  const thoughts = await returnRawQuery(thoughtsSql);
  logger.log(thoughts);
  res.status(200).json({ thoughts });
};

const updateReaderBookDates = async (req, res, next) => {
  try {
    const userId = req.session.passport.user;
    const { bookId } = req.params;
    logger.log(bookId, userId);
    const { startingDate, finishingDate } = req.body;
    const readerBookRecord = await BookReadingState.update(
      { starting_date: startingDate, finishing_date: finishingDate },
      {
        where: {
          userId: userId,
          bookId: bookId,
        },
      }
    );
    res.status(200).json({
      message: "Book record updated",
    });
  } catch (error) {
    next(error);
  }
};

const updateReaderPageNumber = async (req, res, next) => {
  try {
    const userId = req.session.passport.user;
    const { bookId } = req.params;
    const { pageNumber } = req.body;
    const readerBookRecord = await BookReadingState.update(
      { page_number: pageNumber },
      {
        where: {
          userId: userId,
          bookId: bookId,
        },
      }
    );
    res.status(200).json({
      message: "Page number updated",
    });
  } catch (error) {
    next(error);
  }
};

const uploadImage = async (req, res, next) => {
  try {
    const filePath = "../client/public/Pps_and_Bgs";
    const userId = req.session.passport.user;
    let imageValues;
    let imageColumnName;

    for (const key in req.files) {
      imageValues = req.files[key];
    }

    imageColumnName =
      imageValues[0].fieldname == "ppImage"
        ? "profile_photo"
        : "background_photo";
    const userImage = await User.findOne({
      attributes: [imageColumnName],
      where: {
        id: userId,
      },
    });

    logger.log("current ==> ", userImage.toJSON());
    await User.update(
      {
        [imageColumnName]: imageValues[0].filename,
      },
      {
        where: {
          id: userId,
        },
      }
    );

    if (userImage[[imageColumnName]] != null) {
      if (fs.existsSync(filePath)) {
        fs.rm(filePath + `/${userImage[[imageColumnName]]}`, (err) => {
          if (err) {
            logger.log(err);
            throw new Error("No such image exists");
          }
          logger.log("File deleted successfully", userImage[[imageColumnName]]);
        });
      } else {
        throw new Error("No such path exists");
      }
    }

    res.status(200).json({
      message: "success",
    });
  } catch (error) {
    next(error);
  }
};

const getReaderBookshelfOverview = async (req, res, next) => {
  try {
    const userId = req.session.passport.user;
    let yearlyReadBooks = [];
    Array.from({ length: 12 }, (_, i) => {
      yearlyReadBooks.push({
        MONTH: new Date(0, i).toLocaleString("en-US", { month: "short" }),
        quantity: 100,
      });
    });

    const yearlyReadBooksSql = `SELECT MAX(DATE_FORMAT(finishing_date, '%b')) AS MONTH,
                                      COUNT(*) AS "quantity"
                                      FROM book_reading_states
                                      WHERE reading_state = "Read"
                                      AND userId=${userId}
                                      AND YEAR(finishing_date)=YEAR(CURDATE())
                                      GROUP BY MONTH(finishing_date)`;
    const readBooksPerAuthorSql = `SELECT MAX(c.id) AS authorId,MAX(a.bookId) AS bookId,
                                  MAX(c.author) AS author,
                                  COUNT(c.id) AS "quantity"
                                  FROM (SELECT bookId AS bookId
                                  FROM book_reading_states 
                                  WHERE reading_state = "Read"
                                  AND userId=${userId}) a
                                  INNER JOIN author_book_association b
                                  ON a.bookId=b.bookId
                                  INNER JOIN AUTHORS c
                                  ON c.id=b.authorId
                                  GROUP BY c.id 
                                  `;
    const readBooksPerCategorySql = `SELECT MAX(c.id) AS categoryId,MAX(a.bookId) AS bookId,
                                      MAX(c.category) AS category,
                                      COUNT(c.id) AS "quantity"
                                      FROM (SELECT bookId AS bookId
                                      FROM book_reading_states 
                                      WHERE reading_state = "Read"
                                      AND userId=${userId}) a
                                      INNER JOIN category_book_association b
                                      ON a.bookId=b.bookId
                                      INNER JOIN categories c
                                      ON c.id=b.categoryId
                                      GROUP BY c.id 
                                      `;
    let [yearlyReadBooksData, readBooksPerAuthor, readBooksPerCategory] =
      await Promise.all([
        sequelize.query(yearlyReadBooksSql, {
          type: QueryTypes.SELECT,
        }),
        sequelize.query(readBooksPerAuthorSql, {
          type: QueryTypes.SELECT,
        }),
        sequelize.query(readBooksPerCategorySql, {
          type: QueryTypes.SELECT,
        }),
      ]);

    if (yearlyReadBooksData.length != 12) {
      yearlyReadBooksData = new Map(
        yearlyReadBooksData.map((element) => [
          element.MONTH,
          element["quantity"],
        ])
      );

      for (let element of yearlyReadBooks) {
        if (yearlyReadBooksData.has(element.MONTH)) {
          element["quantity"] = yearlyReadBooksData.get(element.MONTH);
        }
      }
    }

    res.status(200).json({
      yearlyReadBooks,
      readBooksPerAuthor,
      readBooksPerCategory,
    });
  } catch (error) {
    next(error);
  }
};

const getLoggedInReader = async (req, res, next) => {
  try {
    const userId = req.session.passport.user;
    let reviewCountDict = {};
    const userReviewsSql = `SELECT r.review, cba.categoryId, c.category
                        FROM
                            reviews r
                        JOIN 
                          category_book_association cba	ON cba.bookId = r.bookId 
                        JOIN 
                          categories c ON c.id = cba.categoryId
                        WHERE 
                          userId = 6`;
    const reviewCountPerCategorySql = `SELECT COUNT(r.id) review_count, cba.categoryId, c.category
                          FROM
                              reviews r
                          JOIN 
                            category_book_association cba	ON cba.bookId = r.bookId 
                          JOIN 
                            categories c ON c.id = cba.categoryId
                          WHERE 
                            userId = 6
                          GROUP BY 
                            cba.categoryId`;
    const reviewCount = await returnRawQuery(reviewCountPerCategorySql);
    const userReviewsData = await returnRawQuery(userReviewsSql);
    const aa = userReviewsData.map((i) => i.review);
    let user = await User.findByPk(userId, {
      attributes: ["id", "username", "firstname", "lastname", "profile_photo"],
    });

    if (!user) {
      throw new Error("User not found");
    }
    reviewCountDict = { ...reviewCount };
    logger.log(reviewCountDict);
    user = user.toJSON();
    // logger.log(user);
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

const getReaderPostComments = async (req, res, next) => {
  try {
    const { postType, postId: fkPostId } = req.params;
    logger.log(postType, fkPostId);
    const userId = req.session.passport.user;
    const user = await User.findByPk(userId, {
      attributes: ["profile_photo"],
    });
    const pkPostId = await Post.findOne({
      attributes: ["id"],
      where: {
        postId: fkPostId,
        post_type: postType,
      },
    });
    const commentsSql = `SELECT p.id,u.username,u.firstname,u.lastname,
                          te.comment,te.createdAt,p.comment_count
                          FROM posts p
                          INNER JOIN(SELECT c.id,c.comment,c.createdAt,c.userId
                          FROM posts p
                          INNER JOIN comments c
                          ON c.commentToId=p.id
                          AND p.id=${pkPostId.toJSON().id}
                          AND p.post_type="${postType}") te
                          ON te.id=p.postId
                          AND p.post_type="comment"
                          INNER JOIN users u
                          ON u.id=te.userId`;
    let comments, post;

    if (!pkPostId) {
      throw new Error("Post id not found");
    }

    if (postType == "review") {
      post = await Review.findOne({
        attributes: [
          "id",
          "bookId",
          "title",
          "review",
          "createdAt",
          [
            Sequelize.literal(`
              (SELECT GROUP_CONCAT(DISTINCT Publishers.publisher SEPARATOR ', ')
               FROM Publisher_Book_Association AS pba
               JOIN Publishers ON pba.publisherId = Publishers.id
               WHERE pba.bookId = Book_Collection.id) 
            `),
            "publishers",
          ],
          [
            Sequelize.literal(`
             (SELECT GROUP_CONCAT(DISTINCT Authors.author SEPARATOR ', ')
               FROM Author_Book_Association AS aut
               JOIN Authors ON aut.authorId = Authors.id
               WHERE aut.bookId = Book_Collection.id) 
            `),
            "authors",
          ],
          // Using sequelize.col() for prefixed attributes
          [Sequelize.col("User.username"), "username"],
          [Sequelize.col("User.firstname"), "firstname"],
          [Sequelize.col("User.lastname"), "lastname"],
          [Sequelize.col("User.profile_photo"), "profile_photo"],
          [Sequelize.col("Book_Collection.thumbnail"), "thumbnail"],
          [Sequelize.col("Book_Collection.published_date"), "published_date"],
          [
            Sequelize.literal(`CASE WHEN LENGTH(Book_Collection.title) > 100
              THEN CONCAT(SUBSTRING(Book_Collection.title, 1, 100), '...')
              ELSE Book_Collection.title END`),
            "truncated_title",
          ],
          [Sequelize.col("Topic.topic"), "topic"],
          [Sequelize.col("Topic.image"), "topic_image"],
        ],
        include: [
          {
            model: User,
            attributes: [], // No need to include attributes here since we're using sequelize.col()
            required: true,
          },
          {
            model: BookCollection,
            attributes: [], // No need to include attributes here since we're using sequelize.col()
          },
          {
            model: Topic,
            attributes: [], // No need to include attributes here since we're using sequelize.col()
          },
        ],
        where: {
          id: fkPostId,
        },
        raw: true,
        group: ["Review.id", "Book_Collection.id", "Topic.id"],
      });
      logger.log(post);
    } else if (postType == "quote") {
      post = await Quote.findOne({
        attributes: [
          "id",
          "bookId",
          "title",
          "quote",
          "page",
          "createdAt",
          [
            Sequelize.literal(`
              (SELECT GROUP_CONCAT(DISTINCT Publishers.publisher SEPARATOR ', ')
               FROM Publisher_Book_Association AS pba
               JOIN Publishers ON pba.publisherId = Publishers.id
               WHERE pba.bookId = Book_Collection.id) 
            `),
            "publishers",
          ],
          [
            Sequelize.literal(`
             (SELECT GROUP_CONCAT(DISTINCT Authors.author SEPARATOR ', ')
               FROM Author_Book_Association AS aut
               JOIN Authors ON aut.authorId = Authors.id
               WHERE aut.bookId = Book_Collection.id) 
            `),
            "authors",
          ],
        ],
        include: [
          {
            model: User,
            attributes: ["username", "firstname", "lastname", "profile_photo"],
            required: true,
          },
          {
            model: BookCollection,
            attributes: [
              "thumbnail",
              "published_date",
              [
                Sequelize.literal(`CASE WHEN LENGTH(book_collection.title) > 100
              THEN CONCAT(SUBSTRING(book_collection.title, 1, 100), '...')
              ELSE book_collection.title END`),
                "truncated_title",
              ],
            ],
          },
          {
            model: Topic,
            attributes: ["topic", ["image", "topic_image"]],
          },
        ],
        where: {
          id: fkPostId,
        },
      });
    } else if (postType == "thought") {
      post = await Thought.findOne({
        attributes: [
          "id",
          "title",
          "thought",
          "createdAt",
          [
            Sequelize.literal(
              `(SELECT GROUP_CONCAT(thi.image SEPARATOR ', ')
              FROM thoughts t
              JOIN thought_images thi ON t.id=thi.thoughtId)`
            ),
            "post_images",
          ],
        ],
        include: [
          {
            model: User,
            attributes: ["username", "firstname", "lastname", "profile_photo"],
            required: true,
          },
          { model: ThoughtImage, attributes: [], required: true },
          {
            model: Topic,
            attributes: ["topic", ["image", "topic_image"]],
          },
        ],
        where: {
          id: fkPostId,
        },
      });
    } else {
      post = Comment.findOne({
        where: {
          id: fkPostId,
        },
        include: {
          model: User,
          attributes: ["username", "firstname", "lastname", "profile_photo"],
        },
      });
    }

    comments = await returnRawQuery(commentsSql);
    // post = JSON.stringify(post);
    // logger.log(post);
    // logger.log(comments);
    res.status(200).json({
      post,
      comments,
      user,
    });
  } catch (error) {
    next(error);
  }
};

const sendComment = async (req, res, next) => {
  const t = await sequelize.transaction();
  try {
    const { comment, commentToId, postType } = req.body;
    const userId = req.session.passport.user;
    const commentsSql = `SELECT p.id,u.username,u.firstname,u.lastname,
                          te.comment,te.createdAt,p.comment_count
                          FROM posts p
                          INNER JOIN(SELECT c.id,c.comment,c.createdAt,c.userId
                          FROM posts p
                          INNER JOIN comments c
                          ON c.commentToId=p.id
                          AND p.id=${commentToId}
                          AND p.post_type="${postType}") te
                          ON te.id=p.postId
                          AND p.post_type="comment"
                          INNER JOIN users u
                          ON u.id=te.userId`;

    const post = await Post.findOne({
      where: {
        id: commentToId,
      },
    });
    if (!userId) {
      throw new Error("User not logged in");
    }
    if (!post) {
      throw new Error("Post not found");
    }
    if (postType != "comment") {
      await Comment.create(
        {
          comment: comment,
          commentToId: post.id,
          rootParentId: post.id,
          userId: userId,
        },
        { transaction: t }
      );
    } else {
      const commentPost = await Comment.findOne({
        where: {
          id: post.postId,
        },
      });

      if (!commentPost) throw new Error("Comment not found");
      await Comment.create(
        {
          comment: comment,
          commentToId: post.id,
          rootParentId: commentPost.rootParentId,
          userId: userId,
        },
        { transaction: t }
      );
    }

    await Post.update(
      {
        comment_count: sequelize.literal("comment_count + 1"),
      },
      {
        where: {
          id: post.id,
        },
        transaction: t,
      }
    );
    await t.commit();

    const comments = await returnRawQuery(commentsSql);

    logger.log(comments);
    res.status(200).json({
      success: "comment sent",
      comments,
    });
  } catch (error) {
    await t.rollback();
    next(error);
  }
};

const getReaderComments = async (req, res, next) => {
  try {
    const { index } = req.params;
    logger.log("!!!!!!!!!!!!!!!!!!!!!!!!1!!");
    logger.log(index);
    const commentsSql = `SELECT te.post_id,
                          te.post_type,
                          u.username,
                          te.comment_id,
                          te.rootParentId,
                          te.commentToId,
                          te.comment,
                          te.commenter_username,
                          te.commenter_firstname,
                          te.commenter_lastname,
                          te.profile_photo,
                          p.comment_count,
                          te.createdAt
                    FROM users u
                    INNER JOIN
                    (SELECT
                          p.id AS post_id,
                          p.post_type,
                          c.id AS comment_id,
                          c.rootParentId,
                    c.commentToId,
                          c.comment,
                          u.username AS commenter_username,
                          u.firstname AS commenter_firstname,
                          u.lastname AS commenter_lastname,
                          u.profile_photo,
                          c.createdAt

                        FROM
                          comments c
                          INNER JOIN posts p ON p.id = c.commentToId -- get comments' root parents
                          INNER JOIN users u ON u.username = "435ttt" -- get commenter's profile
                        WHERE
                          #c.commentToId = c.rootParentId -- get only the first level comments
                          c.userId = u.id) te -- get only this person's comments
                    ON u.id=te.post_id
                    INNER JOIN posts p
                    ON p.postId=te.comment_id
                    AND p.post_type="comment"
                    Limit 5 offset ${index}
                                        `;

    const [comments] = await sequelize.query(commentsSql);

    res.status(200).json({
      comments,
    });
  } catch (error) {
    next(error);
  }
};

const getThemedTopics = async (req, res, next) => {
  try {
    const { category } = req.params;
    const userId = req.session.passport.user;
    const topicCategory = await TopicCategory.findOne({
      attributes: ["id"],
      where: {
        topic_category: category,
      },
    });
    const themedTopicsSql = `SELECT 
                              t.id, 
                              t.topic, 
                              t.image, 
                              t.post_count, 
                              t.follower_count, 
                              IF(uta.UserId IS NULL, FALSE, TRUE) AS isFollowing 
                            FROM 
                              topic_category_association tca 
                              LEFT JOIN user_topic_association uta ON uta.TopicId = tca.TopicId 
                              AND uta.UserId = ${userId}
                              INNER JOIN topics t ON t.id = tca.TopicId 
                            WHERE 
                              topicCategoryId = ${topicCategory.id};
                            `;
    let [themedTopics] = await sequelize.query(themedTopicsSql);
    logger.log(themedTopics);
    res.status(200).json(themedTopics);
  } catch (error) {
    next(error);
  }
};

const createTopic = async (req, res, next) => {
  const t = await sequelize.transaction();
  try {
    const colorList = ["#095109", "#000", "#710c0c", "#875802", "#00006d"];
    const { topic, category } = req.body;
    const image = colorList[Math.floor(Math.random() * colorList.length)];

    const topicCategoryIds = (
      await TopicCategory.findAll({
        where: {
          topic_category: category,
        },
      })
    ).map((item) => item.id);
    // logger.log(image);
    //     logger.log(topicCategoryIds);
    const newTopic = await Topic.create(
      {
        topic: topic,
        image: image,
      },
      { transaction: t }
    );
    const sql = `INSERT INTO topic_category_association (createdAt,updatedAt,TopicId,topicCategoryId)
                VALUES (NOW(), NOW(), :topicId, :topicCategoryId);`;
    const queries = topicCategoryIds.map((element) => {
      return sequelize.query(sql, {
        replacements: {
          topicId: newTopic.id,
          topicCategoryId: element,
        },
        transaction: t,
      });
    });

    await Promise.all(queries);
    res.status(200).json({
      success: "Topic created",
    });
    await t.commit();
  } catch (error) {
    await t.rollback();
    next(error);
  }
};

const getTopic = async (req, res, next) => {
  try {
    const { topicName } = req.params;
    let topic;
    topic = await Topic.findOne({
      where: {
        topic: topicName,
      },
      raw: true,
    });
    if (!Topic) {
      throw new Error("Topic not found");
    }
    const { count: topicFollowerCount } = await Topic.findAndCountAll({
      include: {
        model: User,
        through: {
          attributes: [],
        },
      },
      where: {
        topic: topicName,
      },
    });
    topic = { ...topic, ...{ topicFollowerCount: topicFollowerCount } };
    logger.log(topicName);
    logger.log(topicFollowerCount);

    res.status(200).json(topic);
  } catch (error) {
    next(error);
  }
};

const getTopicBooks = async (req, res, next) => {
  try {
    const { topicName } = req.params;
    const topic = await Topic.findOne({
      where: {
        topic: topicName,
      },
      raw: true,
    });
    if (!topic) {
      throw new Error("Topic not found");
    }
    logger.log(topic);
    const topicBooks = await Topic.findAll({
      include: {
        model: BookCollection,
        attributes: [],
        required: true,
        through: {
          attributes: ["BookCollectionId"],
          where: {
            TopicId: topic.id,
          },
        },
      },
      raw: true,
    });
    const topicBookIds = topicBooks.map(
      (item) =>
        item["Book_Collections.topic_book_associations.BookCollectionId"]
    );

    const books = await BookCollection.findAll({
      attributes: [
        "id",
        "title",
        "page_count",
        [
          sequelize.literal(`
            CASE 
              WHEN LENGTH(title) > 40 THEN CONCAT(SUBSTRING(title, 1, 40), '...')
              ELSE title 
            END
          `),
          "truncatedTitle",
        ],
        "thumbnail",
        [
          Sequelize.literal(`
            (SELECT GROUP_CONCAT(DISTINCT p.publisher SEPARATOR ', ')
             FROM Publisher_Book_Association pba 
             JOIN Publishers p ON pba.publisherId = p.id 
             WHERE pba.bookId = Book_Collection.id)
          `),
          "publishers",
        ],
        [
          Sequelize.literal(`
            (SELECT GROUP_CONCAT(DISTINCT a.author SEPARATOR ', ')
             FROM Author_Book_Association aut 
             JOIN Authors a ON aut.authorId = a.id 
             WHERE aut.bookId = Book_Collection.id)
          `),
          "authors",
        ],
        [
          sequelize.literal(`
            ROUND(
              (SELECT AVG(rb.rating) 
               FROM Rated_Books rb 
               WHERE rb.bookId = Book_Collection.id 
               AND rb.rating IS NOT NULL)
            , 1)
          `),
          "overallRating",
        ],
        [
          sequelize.literal(`
            (SELECT COUNT(*) 
             FROM Book_Reading_States brs 
             WHERE brs.bookId = Book_Collection.id 
             AND brs.reading_state = 'Read')
          `),
          "peopleRead",
        ],
      ],
      where: {
        id: topicBookIds,
      },
      raw: true,
    });

    const bookPageCounts = books.reduce((acc, curr) => {
      acc[curr.id] = curr.page_count;
      return acc;
    }, {});

    logger.log(books);
    logger.log(topicBookIds);
    logger.log(bookPageCounts);

    res.status(200).json({ books, bookPageCounts });
  } catch (error) {
    next(error);
  }
};

const getTopicPosts = async (req, res, next) => {
  try {
    const { topicName, postType } = req.params;
    const jsonDict = {};
    const result = validationResult(req);
    const topic = await Topic.findOne({
      attributes: ["id"],
      where: {
        topic: topicName,
      },
      raw: true,
    });
    const returnPosts = async (sql) => {
      const result = await returnRawQuery(sql);
      return result;
    };
    let posts;

    if (!result.isEmpty()) {
      return res.status(400).json({ error: result.array() });
    }

    let { sortBy } = matchedData(req);
    sortBy = sortBy != undefined ? "ASC" : "DESC";

    const reviewsSql = `SELECT 
                    r.id,
                    r.bookId,
                    u.id AS userId,
                    u.username, 
                    u.firstname, 
                    u.lastname,
                    u.profile_photo, 
                    r.title, 
                    r.review, 
                    MAX(rb.rating) rating,
                    MAX(lb.is_liked) is_liked,
                    MAX(brs.reading_state) reading_state,
                    MAX(p.comment_count) AS comment_count,   
                    bc.people_read, 
                    CASE WHEN MAX(
                      LENGTH(bc.title)
                    ) > 80 THEN CONCAT(
                      SUBSTRING(
                      MAX(bc.title), 
                      1, 
                      80
                          ), 
                          '...'
                        ) ELSE MAX(bc.title) END AS truncated_title, 
                    GROUP_CONCAT(
                      DISTINCT pu.publisher SEPARATOR ', '
                    ) AS publishers, 
                    GROUP_CONCAT(DISTINCT au.author SEPARATOR ', ') AS authors_, 
                    bc.thumbnail, 
                    bc.published_date,
                    r.createdAt 
                  FROM 
                    reviews r 
                    LEFT JOIN book_collections bc ON r.bookId = bc.id 
                    LEFT JOIN publisher_book_association pba ON pba.bookId = r.bookId 
                    JOIN publishers pu ON pu.id = pba.publisherId 
                    LEFT JOIN author_book_association abo ON abo.bookId = r.bookId 
                    INNER JOIN AUTHORS au ON au.id = abo.authorId  
                    INNER JOIN users u ON u.id = r.userId
                    LEFT JOIN rated_books rb ON rb.bookId = r.bookId
                    AND rb.userId = r.userId
                    LEFT JOIN book_reading_states brs ON brs.bookId = r.bookId
                    AND brs.userId = r.userId
                    LEFT JOIN liked_books lb ON lb.bookId = r.bookId
                    AND lb.userId = r.userId
                    INNER JOIN posts p ON p.postId = r.id
                  WHERE 
                    r.topicId = ${topic.id} 
                  GROUP BY 
                    r.id
                  ORDER BY 
                    r.createdAt ${sortBy};`;
    const thoughtsSql = `SELECT 
                        MAX(t.id) id,
                        MAX(t.title) thought_title,
                        MAX(t.thought) thought,
                        JSON_ARRAYAGG(ti.image) images,
                        MAX(p.comment_count) comment_count,
                        MAX(bc.title) title,
                        CASE 
                            WHEN LENGTH(MAX(bc.title)) > 80 
                            THEN CONCAT(SUBSTRING(MAX(bc.title), 1, 80), '...') 
                            ELSE MAX(bc.title) 
                        END AS truncated_title,
                        MAX(top.topic) topic,
                        MAX(top.image) AS topic_image,
                        MAX(u.username) username,
                        MAX(u.firstname) firstname,
                        MAX(u.lastname) lastname,
                        MAX(u.profile_photo) profile_photo,
                        t.createdAt
                    FROM 
                        thoughts t
                    JOIN 
                        thought_images ti ON t.id = ti.thoughtId
                    JOIN 
                        book_collections bc ON t.bookId = bc.id
                    JOIN 
                        topics top ON t.topicId = top.id
                    JOIN 
                        users u ON t.userId = u.id
                    JOIN
                      posts p ON p.postId = t.id
                      AND p.post_type = "thought"
                    WHERE 
                        top.id = ${topic.id}
                    GROUP BY 
                      t.id
                    ORDER BY 
                      t.createdAt ${sortBy}`;
    const quotesSql = `SELECT 
                    q.id,
                    q.bookId,
                    u.id AS userId,
                    u.username, 
                    u.firstname, 
                    u.lastname,
                    u.profile_photo, 
                    q.title, 
                    q.quote,
                    q.page, 
                    MAX(p.comment_count) AS comment_count,   
                    CASE WHEN MAX(
                      LENGTH(bc.title)
                    ) > 80 THEN CONCAT(
                      SUBSTRING(
                      MAX(bc.title), 
                      1, 
                      80
                          ), 
                          '...'
                        ) ELSE MAX(bc.title) END AS truncated_title, 
                    GROUP_CONCAT(
                      DISTINCT pu.publisher SEPARATOR ', '
                    ) AS publishers, 
                    GROUP_CONCAT(DISTINCT au.author SEPARATOR ', ') AS authors_, 
                    bc.thumbnail, 
                    bc.published_date,
                    q.createdAt 
                  FROM 
                    quotes q 
                    LEFT JOIN book_collections bc ON q.bookId = bc.id 
                    LEFT JOIN publisher_book_association pba ON pba.bookId = q.bookId 
                    JOIN publishers pu ON pu.id = pba.publisherId 
                    LEFT JOIN author_book_association abo ON abo.bookId = q.bookId 
                    INNER JOIN AUTHORS au ON au.id = abo.authorId  
                    INNER JOIN users u ON u.id = q.userId
                    INNER JOIN posts p ON p.postId = q.id
                    AND p.post_type = "quote"
                  WHERE 
                    q.topicId = ${topic.id} 
                  GROUP BY 
                    q.id
                  ORDER BY 
                    q.createdAt ${sortBy};`;

    if (postType == "all") {
      const [reviews, thoughts, quotes] = await Promise.all([
        returnPosts(reviewsSql),
        returnPosts(thoughtsSql),
        returnPosts(quotesSql),
      ]);
      posts = [...reviews, ...thoughts, ...quotes];
      posts = posts.sort((a, b) => {
        return sortBy == "DESC"
          ? new Date(b.createdAt) - new Date(a.createdAt)
          : new Date(a.createdAt) - new Date(b.createdAt);
      });
    } else if (postType == "review") {
      posts = await returnPosts(reviewsSql);
    } else if (postType == "thought") {
      posts = await returnPosts(thoughtsSql);
    } else {
      posts = await returnPosts(quotesSql);
    }

    logger.log("!!!!!!!!!!!!!!!!!!! \n posts ==> \n", posts);
    jsonDict["posts"] = posts;
    res.status(200).json(jsonDict);
  } catch (error) {
    logger.log(error);
    next(error);
  }
};

const getReaderBookModalDetails = async (req, res, next) => {
  try {
    const { bookId } = req.params;
    const userId = req.session.passport.user;
    const readerBookModalDetails = await BookCollection.findAll({
      attributes: ["id", "page_count"],
      include: [
        {
          model: PrivateNote,
          attributes: ["private_note"],
          required: true,
          where: {
            userId: userId,
            bookId: bookId,
          },
        },
        {
          model: BookReadingState,
          attributes: [
            "reading_state",
            "page_number",
            "starting_date",
            "finishing_date",
          ],
          required: true,
          where: {
            userId: userId,
            bookId: bookId,
          },
        },
      ],
    });

    logger.log(readerBookModalDetails);
    res.status(200).json({ readerBookModalDetails });
  } catch (error) {
    next(error);
  }
};

const getTopicReaders = async (req, res, next) => {
  try {
    const { topicName } = req.params;
    const topic = await Topic.findOne({
      where: {
        topic: topicName,
      },
    });
    if (!topic) {
      throw new Error("Topic not found");
    }
    const topicReadersSql = `SELECT 
                                    u.id, 
                                    u.username, 
                                    u.firstname, 
                                    u.lastname, 
                                    u.profile_photo, 
                                    COUNT(brs.reading_state) AS booksRead 
                                  FROM 
                                    user_topic_association uta 
                                    INNER JOIN users u ON u.id = uta.userId 
                                    INNER JOIN book_reading_states brs ON brs.userId = u.id 
                                    AND brs.reading_state = "Read" 
                                  WHERE 
                                    TopicId = 2
                                  GROUP BY
                                    u.id
`;
    const topicReaders = await returnRawQuery(topicReadersSql);
    logger.log(topicReaders);
    res.status(200).json(topicReaders);
  } catch (error) {
    next(error);
  }
};

const getExploreGenerals = async (req, res, next) => {
  try {
    const userId = req.session.passport.user;
    const topicsSql = `SELECT 
                          t.id,t.topic,t.image,t.post_count,t.follower_count,
                          IF(MAX(uta.UserId) IS NULL, FALSE, TRUE) AS isFollowing
                        FROM 
                          topics t 
                          LEFT JOIN 
                          user_topic_association uta
                          ON uta.TopicId = t.id 
                          AND uta.UserId = ${userId}
                        GROUP BY t.id
                        LIMIT 5;
                      `;
    const bookWormsSql = `SELECT 
                            u.id, 
                            u.username, 
                            u.firstname, 
                            u.lastname, 
                            u.profile_photo, 
                            COUNT(brs.id) AS books_read 
                          FROM 
                            users u 
                            LEFT JOIN book_reading_states brs ON brs.userId = u.id 
                            AND brs.reading_state = "Read" 
                          GROUP BY 
                            u.id 
                          LIMIT 
                            20;
                        `;
    const topLikedBooksSql = `SELECT 
                                temp.bookId, 
                                COUNT(temp.bookId) AS liked_count, 
                                ROUND(
                                  AVG(rb.rating), 
                                  1
                                ) AS rate, 
                                CASE WHEN LENGTH(bc.title) > 15 THEN CONCAT(
                                  SUBSTRING(bc.title, 1, 15), 
                                  '...'
                                ) ELSE bc.title END AS truncatedTitle, 
                                bc.title AS title, 
                                bc.thumbnail 
                                FROM 
                                rated_books rb 
                                RIGHT JOIN (
                                  SELECT 
                                    lb.bookId, 
                                    COUNT(lb.bookId) AS liked_count 
                                  FROM 
                                    liked_books lb 
                                  WHERE 
                                    is_liked = 1 
                                  GROUP BY 
                                    lb.bookId 
                                  LIMIT 
                                    15
                                ) temp ON temp.bookId = rb.bookId 
                                INNER JOIN book_collections bc ON bc.id = temp.bookId 
                                GROUP BY 
                                temp.bookId 
                                ORDER BY 
                                temp.liked_count DESC;
                            `;
    const [topics, bookWorms, topLikedBooks] = await Promise.all([
      returnRawQuery(topicsSql),
      returnRawQuery(bookWormsSql),
      returnRawQuery(topLikedBooksSql),
    ]);

    res.status(200).json({ topics, bookWorms, topLikedBooks });
  } catch (error) {
    next(error);
  }
};

const getExploreTopics = async (req, res, next) => {
  try {
    const userId = req.session.passport.user;
    const popularTopicsSql = `SELECT 
                                t.id, 
                                t.topic, 
                                t.image,
                                t.post_count, 
                                t.follower_count, 
                                IF(uta.UserId IS NULL, FALSE, TRUE) AS isFollowing 
                              FROM 
                                topics t 
                                LEFT JOIN user_topic_association uta ON uta.TopicId = t.id 
                                AND uta.UserId = ${userId} 
                              ORDER BY 
                                t.follower_count DESC
                              LIMIT 10;
                    `;
    const popularTopics = await returnRawQuery(popularTopicsSql);
    logger.log(popularTopics);
    res.status(200).json({ trendingTopics, popularTopics });
  } catch (error) {
    next(error);
  }
};

const getExploreBooks = async (req, res, next) => {
  try {
    const whatShallIread = "";

    const mostReadLastMonthSql = `SELECT 
                                    brs.bookId id, 
                                    MAX(brs.createdAt),
                                    COUNT(DISTINCT brs.id) people_read, 
                                    COUNT(DISTINCT lb.id) likes, 
                                    ROUND(
                                      AVG(rb.rating), 
                                      1
                                    ) rate, 
                                    CASE WHEN LENGTH(bc.title) > 15 THEN CONCAT(
                                      SUBSTRING(bc.title, 1, 15), 
                                      '...'
                                    ) ELSE bc.title END truncatedTitle, 
                                    bc.title, 
                                    bc.thumbnail 
                                  FROM 
                                    book_reading_states brs 
                                    LEFT JOIN liked_books lb ON lb.bookId = brs.bookId 
                                    AND lb.is_liked = 1 
                                    LEFT JOIN rated_books rb ON rb.bookId = brs.bookId 
                                    AND rb.rating IS NOT NULL 
                                    JOIN book_collections bc ON bc.id = brs.bookId 
                                  WHERE 
                                    brs.reading_state = "Read"
                                    AND brs.createdAt >= DATE_FORMAT(
                                  CURDATE() - INTERVAL 1 MONTH, 
                                  '%Y-%m-01'
                                ) 
                                AND brs.createdAt < DATE_FORMAT(
                                  CURDATE(), 
                                  '%Y-%m-01'
                                ) 
                                  GROUP BY 
                                    brs.bookId  `;
    const mostReadLastYearSql = `SELECT 
                                  brs.bookId id, 
                                  MAX(brs.createdAt),
                                  COUNT(DISTINCT brs.id) people_read, 
                                  COUNT(DISTINCT lb.id) likes, 
                                  ROUND(
                                    AVG(rb.rating), 
                                    1
                                  ) rate, 
                                  CASE WHEN LENGTH(bc.title) > 15 THEN CONCAT(
                                    SUBSTRING(bc.title, 1, 15), 
                                    '...'
                                  ) ELSE bc.title END truncatedTitle, 
                                  bc.title, 
                                  bc.thumbnail 
                                FROM 
                                  book_reading_states brs 
                                  LEFT JOIN liked_books lb ON lb.bookId = brs.bookId 
                                  AND lb.is_liked = 1 
                                  LEFT JOIN rated_books rb ON rb.bookId = brs.bookId 
                                  AND rb.rating IS NOT NULL 
                                  JOIN book_collections bc ON bc.id = brs.bookId 
                                WHERE 
                                  brs.reading_state = "Read"
                                  AND brs.createdAt >= DATE_FORMAT(
                                CURDATE() - INTERVAL 1 YEAR, 
                                '%Y-%m-01'
                              ) 
                              AND brs.createdAt < DATE_FORMAT(
                                CURDATE(), 
                                '%Y-%m-01'
                              ) 
                                GROUP BY 
                                  brs.bookId
                      `;
    const mostLikedSql = `SELECT 
                            lb.bookId, 
                            ROUND(
                              AVG(rating), 
                              1
                            ) rate, 
                            COUNT(DISTINCT brs.id) people_read, 
                            COUNT(DISTINCT lb.id) likes, 
                            CASE WHEN LENGTH(bc.title) > 15 THEN CONCAT(
                              SUBSTRING(bc.title, 1, 15), 
                              '...'
                            ) ELSE bc.title END truncatedTitle, 
                            bc.title, 
                            bc.thumbnail 
                          FROM 
                            liked_books lb 
                            LEFT JOIN rated_books rb ON rb.bookId = lb.bookId 
                            LEFT JOIN book_reading_states brs ON brs.bookId = lb.bookId 
                            AND brs.reading_state = "Read" 
                            JOIN book_collections bc ON bc.id = rb.bookId 
                          WHERE 
                            is_liked = 1 
                          GROUP BY 
                            lb.bookId;
 `;
    const mostReadSql = `SELECT 
                          brs.bookId id, 
                          COUNT(DISTINCT brs.id) people_read, 
                          COUNT(DISTINCT lb.id) likes, 
                          ROUND(
                            AVG(rb.rating), 
                            1
                          ) rate, 
                          CASE WHEN LENGTH(bc.title) > 15 THEN CONCAT(
                            SUBSTRING(bc.title, 1, 15), 
                            '...'
                          ) ELSE bc.title END truncatedTitle, 
                          bc.title, 
                          bc.thumbnail 
                        FROM 
                          book_reading_states brs 
                          LEFT JOIN liked_books lb ON lb.bookId = brs.bookId 
                          AND lb.is_liked = 1 
                          LEFT JOIN rated_books rb ON rb.bookId = brs.bookId 
                          AND rb.rating IS NOT NULL 
                          JOIN book_collections bc ON bc.id = brs.bookId 
                        WHERE 
                          brs.reading_state = "Read" 
                        GROUP BY 
                          brs.bookId
`;
    const highestRatedSql = `SELECT 
                              rb.bookId, 
                              ROUND(
                                AVG(rating), 
                                1
                              ) rate, 
                              COUNT(DISTINCT brs.id) people_read, 
                              COUNT(DISTINCT lb.id) likes, 
                              CASE WHEN LENGTH(bc.title) > 15 THEN CONCAT(
                                SUBSTRING(bc.title, 1, 15), 
                                '...'
                              ) ELSE bc.title END truncatedTitle, 
                              bc.title, 
                              bc.thumbnail 
                            FROM 
                              rated_books rb 
                              LEFT JOIN liked_books lb ON lb.bookId = rb.bookId 
                              AND lb.is_liked = 1 
                              LEFT JOIN book_reading_states brs ON brs.bookId = rb.bookId 
                              AND brs.reading_state = "Read" 
                              JOIN book_collections bc ON bc.id = rb.bookId 
                            WHERE 
                              rating IS NOT NULL 
                            GROUP BY 
                              rb.bookId;`;
    const [
      mostRead,
      mostLiked,
      highestRated,
      mostReadLastMonth,
      mostReadLastYear,
    ] = await Promise.all([
      returnRawQuery(mostReadSql),
      returnRawQuery(mostLikedSql),
      returnRawQuery(highestRatedSql),
      returnRawQuery(mostReadLastMonthSql),
      returnRawQuery(mostReadLastYearSql),
    ]);

    res.status(200).json({
      mostRead,
      mostLiked,
      highestRated,
      mostReadLastMonth,
      mostReadLastYear,
    });
  } catch (error) {
    logger.log(error);
    next(error);
  }
};

const getTrendingTopics = async (req, res, next) => {
  try {
    const updated = await returnRawQuery(trendingTopicsSql);
    logger.log(updated);
    res.status(200).json(updated);
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

const setFollowingState = async (req, res, next) => {
  try {
    const userId = req.session.passport.user;
    const { topicId, isFollowed } = req.body;
    logger.log(topicId, isFollowed);
    if (!userId) {
      throw new Error("User not logged in");
    }
    const sqlUpdate = `INSERT INTO user_topic_association 
                        (createdAt,updatedAt,TopicId, UserId)
                        VALUES (NOW(), NOW(), ${topicId}, ${userId})`;
    const sqlDelete = `DELETE FROM user_topic_association  
                        WHERE UserId = ${userId} 
                        AND TopicId = ${topicId}`;

    if (isFollowed) {
      await returnRawQuery(sqlUpdate, QueryTypes.INSERT);
    } else {
      await returnRawQuery(sqlDelete, QueryTypes.DELETE);
    }

    res.status(200).json({ message: "Success" });
  } catch (error) {
    next(error);
  }
};

const getBookCategories = async (req, res, next) => {
  try {
    const result = validationResult(req);
    if (!result.isEmpty()) {
      throw new Error({ error: result.array() });
    }
    const { q, index } = matchedData(req);
    logger.log("???????????????????????????????");
    logger.log(index);

    const offset = index == undefined ? "OFFSET 0" : `OFFSET ${index}`;
    const where = q ? `WHERE c.category LIKE '${q}%'` : "";
    const bookCategoriesSql = `SELECT 
                                  * 
                                FROM 
                                  (
                                    SELECT 
                                      COUNT(cba.id) book_count, 
                                      categoryId id, 
                                      c.category 
                                    FROM 
                                      category_book_association cba 
                                      INNER JOIN categories c ON c.id = cba.categoryId 
                                      ${where}
                                      GROUP BY 
                                      categoryId 
                                    ORDER BY 
                                      COUNT(cba.id) DESC
                                  ) temp 
                                LIMIT 
                                  50 
                                ${offset}  
                                  `;
    const bookCategories = await returnRawQuery(bookCategoriesSql);
    res.status(200).json(bookCategories);
  } catch (error) {
    next(error);
  }
};

const getCategoryBooks = async (req, res, next) => {
  try {
    const result = validationResult(req);
    if (!result.isEmpty()) {
      throw new Error({ error: result.array() });
    }
    const { categoryId } = matchedData(req);
    const category = await Category.findByPk(categoryId);
    if (!category) {
      throw new Error("Category not found");
    }

    const mostReadLastMonthSql = `SELECT 
                                    * 
                                  FROM 
                                    (
                                      SELECT 
                                        brs.bookId id, 
                                        MAX(brs.createdAt), 
                                        COUNT(DISTINCT brs.id) people_read, 
                                        COUNT(DISTINCT lb.id) likes, 
                                        ROUND(
                                          AVG(rb.rating), 
                                          1
                                        ) rate, 
                                        CASE WHEN LENGTH(bc.title) > 15 THEN CONCAT(
                                          SUBSTRING(bc.title, 1, 15), 
                                          '...'
                                        ) ELSE bc.title END truncatedTitle, 
                                        bc.title, 
                                        bc.thumbnail 
                                      FROM 
                                        book_reading_states brs 
                                        LEFT JOIN liked_books lb ON lb.bookId = brs.bookId 
                                        AND lb.is_liked = 1 
                                        LEFT JOIN rated_books rb ON rb.bookId = brs.bookId 
                                        AND rb.rating IS NOT NULL 
                                        JOIN book_collections bc ON bc.id = brs.bookId 
                                      WHERE 
                                        brs.reading_state = "Read" 
                                        AND brs.createdAt >= DATE_FORMAT(
                                          CURDATE() - INTERVAL 1 MONTH, 
                                          '%Y-%m-01'
                                        ) 
                                        AND brs.createdAt < DATE_FORMAT(
                                          CURDATE(), 
                                          '%Y-%m-01'
                                        ) 
                                      GROUP BY 
                                        brs.bookId
                                    ) temp 
                                  WHERE 
                                    id IN (
                                      SELECT 
                                        bookId 
                                      FROM 
                                        category_book_association 
                                      WHERE 
                                        categoryId = ${categoryId}
                                    )
                                  `;
    const mostReadLastYearSql = `SELECT 
                                * 
                              FROM 
                                (
                                  SELECT 
                                    brs.bookId id, 
                                    MAX(brs.createdAt), 
                                    COUNT(DISTINCT brs.id) people_read, 
                                    COUNT(DISTINCT lb.id) likes, 
                                    ROUND(
                                      AVG(rb.rating), 
                                      1
                                    ) rate, 
                                    CASE WHEN LENGTH(bc.title) > 15 THEN CONCAT(
                                      SUBSTRING(bc.title, 1, 15), 
                                      '...'
                                    ) ELSE bc.title END truncatedTitle, 
                                    bc.title, 
                                    bc.thumbnail 
                                  FROM 
                                    book_reading_states brs 
                                    LEFT JOIN liked_books lb ON lb.bookId = brs.bookId 
                                    AND lb.is_liked = 1 
                                    LEFT JOIN rated_books rb ON rb.bookId = brs.bookId 
                                    AND rb.rating IS NOT NULL 
                                    JOIN book_collections bc ON bc.id = brs.bookId 
                                  WHERE 
                                    brs.reading_state = "Read" 
                                    AND brs.createdAt >= DATE_FORMAT(
                                      CURDATE() - INTERVAL 1 YEAR, 
                                      '%Y-%m-01'
                                    ) 
                                    AND brs.createdAt < DATE_FORMAT(
                                      CURDATE(), 
                                      '%Y-%m-01'
                                    ) 
                                  GROUP BY 
                                    brs.bookId
                                ) temp 
                              WHERE 
                                id IN (
                                  SELECT 
                                    bookId 
                                  FROM 
                                    category_book_association 
                                  WHERE 
                                    categoryId = ${categoryId}
                                )
                              `;
    const mostLikedSql = `SELECT 
                        * 
                      FROM 
                        (
                          SELECT 
                            lb.bookId id, 
                            ROUND(
                              AVG(rating), 
                              1
                            ) rate, 
                            COUNT(DISTINCT brs.id) people_read, 
                            COUNT(DISTINCT lb.id) likes, 
                            CASE WHEN LENGTH(bc.title) > 15 THEN CONCAT(
                              SUBSTRING(bc.title, 1, 15), 
                              '...'
                            ) ELSE bc.title END truncatedTitle, 
                            bc.title, 
                            bc.thumbnail 
                          FROM 
                            liked_books lb 
                            LEFT JOIN rated_books rb ON rb.bookId = lb.bookId 
                            LEFT JOIN book_reading_states brs ON brs.bookId = lb.bookId 
                            AND brs.reading_state = "Read" 
                            JOIN book_collections bc ON bc.id = rb.bookId 
                          WHERE 
                            is_liked = 1 
                          GROUP BY 
                            lb.bookId
                        ) temp 
                      WHERE 
                        id IN (
                          SELECT 
                            bookId 
                          FROM 
                            category_book_association 
                          WHERE 
                            categoryId = ${categoryId}
                        )
                      `;
    const mostReadSql = `SELECT 
                        * 
                      FROM 
                        (
                          SELECT 
                            brs.bookId id, 
                            MAX(brs.createdAt), 
                            COUNT(DISTINCT brs.id) people_read, 
                            COUNT(DISTINCT lb.id) likes, 
                            ROUND(
                              AVG(rb.rating), 
                              1
                            ) rate, 
                            CASE WHEN LENGTH(bc.title) > 15 THEN CONCAT(
                              SUBSTRING(bc.title, 1, 15), 
                              '...'
                            ) ELSE bc.title END truncatedTitle, 
                            bc.title, 
                            bc.thumbnail 
                          FROM 
                            book_reading_states brs 
                            LEFT JOIN liked_books lb ON lb.bookId = brs.bookId 
                            AND lb.is_liked = 1 
                            LEFT JOIN rated_books rb ON rb.bookId = brs.bookId 
                            AND rb.rating IS NOT NULL 
                            JOIN book_collections bc ON bc.id = brs.bookId 
                          WHERE 
                            brs.reading_state = "Read" 
                          GROUP BY 
                            brs.bookId
                        ) temp 
                      WHERE 
                        id IN (
                          SELECT 
                            bookId 
                          FROM 
                            category_book_association 
                          WHERE 
                            categoryId = ${categoryId}
                        )
                      `;
    const highestRatedSql = `SELECT 
                            * 
                          FROM 
                            (
                              SELECT 
                                rb.bookId id, 
                                ROUND(
                                  AVG(rating), 
                                  1
                                ) rate, 
                                COUNT(DISTINCT brs.id) people_read, 
                                COUNT(DISTINCT lb.id) likes, 
                                CASE WHEN LENGTH(bc.title) > 15 THEN CONCAT(
                                  SUBSTRING(bc.title, 1, 15), 
                                  '...'
                                ) ELSE bc.title END truncatedTitle, 
                                bc.title, 
                                bc.thumbnail 
                              FROM 
                                rated_books rb 
                                LEFT JOIN liked_books lb ON lb.bookId = rb.bookId 
                                AND lb.is_liked = 1 
                                LEFT JOIN book_reading_states brs ON brs.bookId = rb.bookId 
                                AND brs.reading_state = "Read" 
                                JOIN book_collections bc ON bc.id = rb.bookId 
                              WHERE 
                                rating IS NOT NULL 
                              GROUP BY 
                                rb.bookId
                            ) temp 
                          WHERE 
                            id IN (
                              SELECT 
                                bookId 
                              FROM 
                                category_book_association 
                              WHERE 
                                categoryId = ${categoryId}
                            )
                          `;
    const [
      mostRead,
      mostLiked,
      highestRated,
      mostReadLastMonth,
      mostReadLastYear,
    ] = await Promise.all([
      returnRawQuery(mostReadSql),
      returnRawQuery(mostLikedSql),
      returnRawQuery(highestRatedSql),
      returnRawQuery(mostReadLastMonthSql),
      returnRawQuery(mostReadLastYearSql),
    ]);
    logger.log(
      mostRead,
      mostLiked,
      highestRated,
      mostReadLastMonth,
      mostReadLastYear
    );

    res.status(200).json({
      category,
      mostRead,
      mostLiked,
      highestRated,
      mostReadLastMonth,
      mostReadLastYear,
    });
  } catch (error) {
    logger.log(error);
    next(error);
  }
};

const getSidebarTopics = async (req, res, next) => {
  try {
    const topicsSql = `SELECT 
                          t.id,
                          t.topic,
                          t.image,
                          t.post_count,t.follower_count
                        FROM 
                          topics t 
                        GROUP BY
                          t.id
                        LIMIT 5;
                      `;
    const topics = await returnRawQuery(topicsSql);
    logger.log(topics);
    res.status(200).json(topics);
  } catch (error) {
    logger.log(error);
    next(error);
  }
};

const createCheckoutSession = async (req, res, next) => {
  try {
    const { premiumType } = req.body;
    const userId = req.session.passport.user;
    const prices = await stripe.prices.list({
      lookup_keys: [premiumType],
    });
    const priceId =
      premiumType == "Annual"
        ? "price_1QlxgDHBAbJebqsa0nRY5sF3"
        : "price_1QlxhAHBAbJebqsaNsM3sUEk";
    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      subscription_data: {
        metadata: {
          user_id: userId,
        },
      },
      mode: "subscription",
      success_url: `${process.env.DOMAIN}/return?success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.DOMAIN}/return?canceled=true&session_id={CHECKOUT_SESSION_ID}`,
    });

    res.send({
      url: session.url,
    });
  } catch (error) {
    logger.log(error);
    next(error);
  }
};

const listenWebhook = async (req, res, next) => {
  let event = req.body;
  let paymentIntent;
  logger.log("event triggered");

  if (endpointSecret) {
    // Get the signature sent by Stripe
    const signature = req.headers["stripe-signature"];
    try {
      event = stripe.webhooks.constructEvent(
        req.rawBody,
        signature,
        endpointSecret
      );
    } catch (err) {
      logger.log(`⚠️  Webhook signature verification failed.`, err.message);
      next(err);
    }
  }

  // Handle the event
  if (event.type) {
    if (event.type === "checkout.session.completed") {
      paymentIntent = event.data.object;
      logger.log("Event listned,payment success");
      logger.log("\n", event.data.object);
      await Transaction.create({
        cardholder_name: paymentIntent.customer_details.name,
        email: paymentIntent.customer_details.email,
        country: paymentIntent.customer_details.address.country,
        postal_code: paymentIntent.customer_details.address.postal_code,
        customer_id: paymentIntent.customer,
        checkout_session_id: paymentIntent.id,
        amount_total: paymentIntent.amount_total,
        currency: paymentIntent.currency,
        mode: paymentIntent.mode,
        payment_status: paymentIntent.payment_status,
        payment_method_configuration_id:
          paymentIntent.payment_method_configuration_details.id,
        subscription_id: paymentIntent.subscription,
        expires_at: paymentIntent.expires_at,
        userId: paymentIntent.metadata.user_id,
      });
    } else if (event.type === "checkout.session.expired") {
      logger.log("Event listned,checkout expired");
      paymentIntent = event.data.object;
      logger.log("\n", event.data.object);
      await Transaction.create({
        cardholder_name: null,
        email: null,
        country: null,
        postal_code: null,
        customer_id: null,
        checkout_session_id: paymentIntent.id,
        amount_total: paymentIntent.amount_total,
        currency: paymentIntent.currency,
        mode: paymentIntent.mode,
        payment_status: paymentIntent.payment_status,
        payment_method_configuration_id:
          paymentIntent.payment_method_configuration_details.id,
        subscription_id: null,
        expires_at: null,
        userId: paymentIntent.metadata.user_id,
      });
    } else if (event.type === "customer.subscription.updated") {
      paymentIntent = event.data.object;
      await Subscription.create({
        cancel_at: paymentIntent.cancel_at,
        canceled_at: paymentIntent.canceled_at,
        start_date: paymentIntent.start_date,
        billing_cycle_anchor: paymentIntent.billing_cycle_anchor,
        interval: paymentIntent.plan.interval,
        comment: paymentIntent.cancellation_details.comment,
        feedback: paymentIntent.cancellation_details.feedback,
        reason: paymentIntent.cancellation_details.reaosn,
        subscription_id: paymentIntent.id,

        customer_id: paymentIntent.customer,
        product_id: paymentIntent.plan.product,
        amount_total: paymentIntent.plan.amount,
        currency: paymentIntent.plan.currency,
        status: paymentIntent.status,
        userId: paymentIntent.metadata.user_id,
      });
      logger.log("Event listned,subscription updated");
      logger.log("\n", event.data.object);
    } else logger.log(`Unhandled event type ${event.type}`);
  }

  // Return a res to acknowledge receipt of the event
  res.json({ received: true });
};

export {
  listenWebhook,
  createCheckoutSession,
  shareReview,
  getBookReviews,
  setPrivateNote,
  setReadingState,
  setBookLiked,
  setBookRate,
  getReaderBookDetailsAndHeader,
  setUserBookRecord,
  getBookStatistics,
  getReaderProfiles,
  displayReaderProfile,
  filterReaderBooks,
  getReaderReviews,
  updateReaderBookDates,
  updateReaderPageNumber,
  uploadImage,
  getReaderBookshelfOverview,
  getLoggedInReader,
  getReaderPostComments,
  sendComment,
  getReaderComments,
  getThemedTopics,
  createTopic,
  getReaderThoughts,
  getReaderQuotes,
  getTopic,
  getTopicBooks,
  getReaderBookModalDetails,
  getTopicReaders,
  getExploreGenerals,
  getExploreTopics,
  getExploreBooks,
  getTopicCategories,
  setFollowingState,
  getTrendingTopics,
  getTopicPosts,
  getBookCategories,
  getCategoryBooks,
  getSidebarTopics,
};
