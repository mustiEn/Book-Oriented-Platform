import fs from "fs";
import { matchedData, validationResult } from "express-validator";

import { QueryTypes, Sequelize } from "sequelize";
import { sequelize } from "../models/db.js";

import { Review } from "../models/Review.js";
import { User } from "../models/User.js";
import { PrivateNote } from "../models/PrivateNote.js";
import { LikedBook } from "../models/LikedBook.js";
import { RatedBook } from "../models/RatedBook.js";
import { BookReadingState } from "../models/BookReadingState.js";
import { Post } from "../models/Post.js";
import { Quote } from "../models/Quote.js";
import { Thought } from "../models/Thought.js";
import { Comment } from "../models/Comment.js";
import { TopicCategory } from "../models/TopicCategory.js";
import { Topic } from "../models/Topic.js";
import { BookCollection } from "../models/BookCollection.js";
import { Transaction } from "../models/Transaction.js";
import { Category } from "../models/Category.js";
import { Subscription } from "../models/Subscription.js";
import { Notification } from "../models/Notification.js";

import { trendingTopics, trendingTopicsSql } from "../crons/index.js";
import { logger, returnFromRaw } from "../utils/constants.js";

import Stripe from "stripe";
import dotenv from "dotenv";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const endpointSecret = process.env.STRIPE_WEBHOOK_ENDPOINT_SECRET;
dotenv.config();

export const shareReview = async (req, res, next) => {
  //^ Gets topic, title, review and bookId.
  //^ Checks if topic exists, if so, it creates a review
  try {
    const userId = req.session.passport.user;
    const result = validationResult(req);
    let topic;

    if (!result.isEmpty()) {
      throw new Error(result.array()[0].msg);
    }

    const { topic: topicName, title, review, bookId } = matchedData(req);

    if (topicName != null) {
      topic = await Topic.findOne({
        where: {
          topic: topicName,
        },
      });

      if (!topic) {
        console.log("hey");
        throw new Error("Topic not found");
      }
    }

    await Review.create({
      title,
      review,
      topicId: topicName == null ? null : topic.toJSON().id,
      bookId,
      userId,
    });

    return res.status(200).json({
      message: "Review added successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const shareQuote = async (req, res, next) => {
  //^ Gets topic, title, quote and bookId.
  //^ Checks if topic exists, if so, it creates a quote
  try {
    const userId = req.session.passport.user;
    const result = validationResult(req);
    let topic;

    if (!result.isEmpty()) {
      throw new Error(result.array()[0].msg);
    }

    const {
      topic: topicName,
      title,
      page_count: page,
      quote,
      bookId,
    } = matchedData(req);

    if (topicName != null) {
      topic = await Topic.findOne({
        where: {
          topic: topicName,
        },
      });

      if (!topic) {
        throw new Error("Topic not found");
      }
    }

    await Quote.create({
      title,
      quote,
      page,
      topicId: topicName == null ? null : topic.toJSON().id,
      bookId,
      userId,
    });

    return res.status(200).json({
      message: "Quote added successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const shareThought = async (req, res, next) => {
  //^ Gets topic, title, quote and bookId.
  //^ Checks if topic exists, if so, it creates a quote
  try {
    const userId = req.session.passport.user;
    const result = validationResult(req);
    let topic;

    if (!result.isEmpty()) {
      throw new Error(result.array()[0].msg);
    }

    const { topic: topicName, title, thought, bookId } = matchedData(req);

    if (topicName != null) {
      topic = await Topic.findOne({
        where: {
          topic: topicName,
        },
      });

      if (!topic) {
        throw new Error("Topic not found");
      }
    }

    await Thought.create({
      title,
      thought,
      topicId: topicName == null ? null : topic.toJSON().id,
      bookId: bookId ?? null,
      userId,
    });

    return res.status(200).json({
      message: "Thought added successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const getHomePagePosts = async (req, res, next) => {
  try {
    const results = validationResult(req);
    let posts;

    if (!results.isEmpty()) {
      throw new Error(
        `Validation failed.\n Msg: ${results.array()[0].msg}.\n Path: ${
          results.array()[0].path
        }`
      );
    }

    const { index: offset } = matchedData(req);
    const limit = 20;
    const reviewsSql = `
      SELECT
        MAX(p.id) id,
        MAX(p.post_type) AS type,
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
        MAX(top.topic) topic, 
        MAX(top.image) AS topic_image, 
        MAX(p.comment_count) AS comment_count, 
        bc.people_read, 
        bc.title AS book_title, 
        CASE WHEN MAX(
          LENGTH(bc.title)
        ) > 50 THEN CONCAT(
          SUBSTRING(
            bc.title, 
            1, 
            50
          ), 
          '...'
        ) ELSE bc.title END AS truncated_title, 
        bc.thumbnail, 
        bc.published_date, 
        r.createdAt 
      FROM 
        reviews r 
        LEFT JOIN book_collections bc ON r.bookId = bc.id  
        INNER JOIN users u ON u.id = r.userId 
        LEFT JOIN rated_books rb ON rb.bookId = r.bookId 
        AND rb.userId = r.userId 
        LEFT JOIN book_reading_states brs ON brs.bookId = r.bookId 
        AND brs.userId = r.userId 
        LEFT JOIN liked_books lb ON lb.bookId = r.bookId 
        AND lb.userId = r.userId 
        LEFT JOIN topics top ON r.topicId = top.id 
        INNER JOIN posts p ON p.postId = r.id 
        AND p.post_type = "review"
        AND is_restricted = 0
      GROUP BY 
        r.id
      ORDER BY 
        r.createdAt DESC
      LIMIT ${limit} OFFSET ${offset};
    `;
    const thoughtsSql = `
      SELECT 
        p.id id,
        p.post_type AS TYPE, 
        t.title thought_title, 
        t.thought thought, 
        p.comment_count comment_count, 
        bc.title title, 
        CASE WHEN LENGTH(
          bc.title
        ) > 50 THEN CONCAT(
          SUBSTRING(
            bc.title, 
            1, 
            50
          ), 
          '...'
        ) ELSE bc.title END AS truncated_title, 
        top.topic topic, 
        top.image AS topic_image, 
        u.username username, 
        u.firstname firstname, 
        u.lastname lastname, 
        u.profile_photo profile_photo, 
        t.createdAt 
      FROM 
        thoughts t 
        LEFT JOIN book_collections bc ON t.bookId = bc.id 
        LEFT JOIN topics top ON t.topicId = top.id 
        JOIN users u ON t.userId = u.id 
        JOIN posts p ON p.postId = t.id 
        AND p.post_type = "thought"   
        AND is_restricted = 0
      ORDER BY 
        t.createdAt DESC
      LIMIT ${limit} OFFSET ${offset};  
    `;
    const quotesSql = `
      SELECT 
        MAX(p.id) id,
        MAX(p.post_type) AS type,
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
        MAX(top.topic) topic, 
        MAX(top.image) AS topic_image,
        bc.title AS book_title, 
        CASE WHEN MAX(
          LENGTH(bc.title)
        ) > 50 THEN CONCAT(
          SUBSTRING(
            bc.title, 
            1, 
            50
          ), 
          '...'
        ) ELSE bc.title END AS truncated_title,
        bc.thumbnail, 
        bc.published_date,
        q.createdAt 
      FROM 
        quotes q 
        LEFT JOIN book_collections bc ON q.bookId = bc.id  
        LEFT JOIN topics top ON q.topicId = top.id
        INNER JOIN users u ON u.id = q.userId
        INNER JOIN posts p ON p.postId = q.id
        AND p.post_type = "quote"
        AND is_restricted = 0
      GROUP BY 
        q.id
      ORDER BY 
        q.createdAt DESC
      LIMIT ${limit} OFFSET ${offset};
    `;

    const [reviews, thoughts, quotes] = await Promise.all([
      returnFromRaw(reviewsSql),
      returnFromRaw(thoughtsSql),
      returnFromRaw(quotesSql),
    ]);

    posts = [...reviews, ...thoughts, ...quotes];
    posts = posts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    res.status(200).json(posts);
  } catch (error) {
    next(error);
  }
};

export const getBookReviews = async (req, res, next) => {
  try {
    //^ Gets bookId, and returns all reviews for that book.
    //^ Creates a new Map for ratings and organises
    //^ the data as rating (1-2-3-4-5):num of people that rated for that number
    const result = validationResult(req);

    if (!result.isEmpty()) {
      throw new Error(result.array()[0].msg);
    }

    const { bookId } = matchedData(req);
    const totalRatingSql = `SELECT ROUND(AVG(rating),1) AS rate,
                          COUNT(*) AS total_people_rated
                        FROM rated_books
                        WHERE bookId= ?
                        `;
    const reviewsSql = `SELECT 
                          MAX(rb.id) AS id, 
                          MAX(rb.rating) AS rating, 
                          MAX(r.userId), 
                          MAX(r.title) AS title, 
                          r.bookId AS reviewBookId, 
                          MAX(r.review) AS review, 
                          MAX(r.createdAt) AS created_at, 
                          MAX(t.topic) AS topic, 
                          MAX(c.reading_state) AS reading_state, 
                          MAX(c.page_number) AS page_number, 
                          u.username, 
                          u.firstname, 
                          u.lastname, 
                          u.profile_photo 
                        FROM 
                          reviews r 
                          LEFT JOIN rated_books rb ON r.userId = rb.userId 
                          LEFT JOIN topics t ON t.id = r.topicId 
                          LEFT JOIN book_reading_states c ON c.userId = r.userId 
                          INNER JOIN users u ON u.id = r.userId 
                        WHERE 
                          r.bookId = ? 
                        GROUP BY 
                          r.userId
                        `;
    const ratingsSql = `SELECT rating,COUNT(rating) AS total
                        FROM rated_books
                        WHERE bookId= ?
                        GROUP BY rating`;
    const [reviews, ratings, totalRating] = await Promise.all([
      returnFromRaw(reviewsSql, [bookId]),
      returnFromRaw(ratingsSql, [bookId]),
      returnFromRaw(totalRatingSql, [bookId]),
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

export const setPrivateNote = async (req, res, next) => {
  try {
    const userId = req.session.passport.user;
    const result = validationResult(req);

    if (!result.isEmpty()) {
      throw new Error(result.array()[0].msg);
    }

    const { privateNote, bookId } = matchedData(req);
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

export const setReadingState = async (req, res, next) => {
  try {
    const userId = req.session.passport.user;
    const result = validationResult(req);

    if (!result.isEmpty()) {
      throw new Error(
        `Validation failed ==>\n Msg: ${result.array()[0].msg}.\n Path: ${
          result.array()[0].path
        }`
      );
    }

    const { readingState, bookId } = matchedData(req);
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

export const setBookLiked = async (req, res, next) => {
  try {
    const userId = req.session.passport.user;
    const result = validationResult(req);

    if (!result.isEmpty()) {
      throw new Error(
        `Validation failed ==>\n Msg: ${result.array()[0].msg}.\n Path: ${
          result.array()[0].path
        }`
      );
    }

    const { isBookLiked, bookId } = matchedData(req);

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

export const setBookRate = async (req, res, next) => {
  try {
    const userId = req.session.passport.user;
    const result = validationResult(req);

    if (!result.isEmpty()) {
      throw new Error(
        `Validation failed ==>\n Msg: ${result.array()[0].msg}.\n Path: ${
          result.array()[0].path
        }`
      );
    }

    const { rate, bookId } = matchedData(req);
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

export const getReaderBookInteractionData = async (req, res, next) => {
  //^ Gets bookId and returns all data about whether it's liked, rated and read.
  try {
    const userId = req.session.passport.user;
    const result = validationResult(req);

    if (!result.isEmpty()) {
      throw new Error(
        `Validation failed ==>\n Msg: ${result.array()[0].msg}.\n Path: ${
          result.array()[0].path
        }`
      );
    }

    const { bookId } = matchedData(req);
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
                                WHERE a.bookId= ?
                                AND a.userId= ?`;
    const readerBookRecord = await returnFromRaw(readerBookRecordSql, [
      bookId,
      userId,
    ]);

    readerBookRecord.rating =
      readerBookRecord.rating == null ? 0 : readerBookRecord.rating;
    readerBookRecord.is_liked =
      readerBookRecord.is_liked == null ? false : readerBookRecord.is_liked;

    res.status(200).json(readerBookRecord);
  } catch (error) {
    next(error);
  }
};

export const setUserBookRecord = async (req, res, next) => {
  //^ Gets bookId and creates records with default vals.
  //^ this is to define views per book
  try {
    const userId = req.session.passport.user;
    const result = validationResult(req);

    if (!result.isEmpty()) {
      throw new Error(
        `Validation failed ==>\n Msg: ${result.array()[0].msg}.\n Path: ${
          result.array()[0].path
        }`
      );
    }

    const { bookId } = matchedData(req);

    const userBookInteraction = await LikedBook.findOne({
      where: {
        bookId: bookId,
        userId: userId,
      },
    });

    if (!userBookInteraction) {
      await Promise.all([
        LikedBook.create({
          bookId: bookId,
          userId: userId,
          is_liked: false,
        }),
        PrivateNote.create({
          bookId: bookId,
          userId: userId,
          private_note: null,
        }),
        BookReadingState.create({
          bookId: bookId,
          userId: userId,
          reading_state: null,
        }),
        RatedBook.create({
          bookId: bookId,
          userId: userId,
          rating: null,
        }),
      ]);
    }

    res.status(200).json({
      message: "Success",
    });
  } catch (error) {
    next(error);
  }
};

export const getBookStatistics = async (req, res, next) => {
  //^ Gets bookId and returns book readers per age, male - female ratio
  try {
    const result = validationResult(req);

    if (!result.isEmpty()) throw new Error(result.array()[0].msg);

    const { bookId } = matchedData(req);
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
                        and b.bookId= ?;`;
    const bookStatisticsSql = `SELECT *, ROUND((male*100)/(male+female),1) AS male_percentage,
                            ROUND((female*100)/(male+female),1) AS female_percentage
                            FROM (SELECT COUNT(reading_state) AS read_
                            FROM book_reading_states
                            WHERE reading_state="Read"
                            AND bookId= ?) a
                            CROSS JOIN
                            (SELECT COUNT(reading_state) AS currently_reading
                            FROM book_reading_states
                            WHERE reading_state="Currently reading"
                            AND bookId= ?)  b
                            CROSS JOIN
                            (SELECT COUNT(reading_state) AS want_to_read
                            FROM book_reading_states
                            WHERE reading_state="Want to read"
                            AND bookId= ?)  c
                            CROSS JOIN
                            (SELECT COUNT(reading_state) AS did_not_finish
                            FROM book_reading_states
                            WHERE reading_state="Did not finish"
                            AND bookId= ?)  d
                            CROSS JOIN
                            (SELECT COUNT(*) AS reviews
                            FROM reviews
                            WHERE bookId= ?) e
                            CROSS JOIN
                            (SELECT ROUND(AVG(rating),1) AS rate
                            FROM rated_books
                            WHERE bookId= ?) f
                            CROSS JOIN
                            (SELECT COUNT(*) AS people_rated
                            FROM rated_books
                            WHERE bookId= ?
                            AND rating IS NOT NULL) g
                            CROSS JOIN
                            (SELECT COUNT(*) AS likes
                            FROM liked_books
                            WHERE bookId= ?
                            AND is_liked=1) h
                            CROSS JOIN
                            (SELECT COUNT(*) AS views
                            FROM liked_books
                            WHERE bookId= ?) i
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
                            AND bookId= ?) t) j`;

    const [readers, bookStatistics] = await Promise.all([
      returnFromRaw(readersSql, [bookId]),
      returnFromRaw(bookStatisticsSql, [
        bookId,
        bookId,
        bookId,
        bookId,
        bookId,
        bookId,
        bookId,
        bookId,
        bookId,
      ]),
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

export const getReaderNotifications = async (req, res, next) => {
  try {
    const userId = req.session.passport.user;
    const unReadNotificationsSql = `UPDATE 
                                      notifications
                                    SET 
                                      is_read = 1
                                    WHERE 
                                      receiverId = ?`;

    await returnFromRaw(unReadNotificationsSql, [userId], QueryTypes.UPDATE);

    const notificationsSql = `SELECT 
                                * 
                              FROM 
                                notifications n 
                              WHERE 
                                receiverId = ?
                              AND 
                                TYPE != "comment"
                              AND
                                is_hidden = 0`;

    const commentNotificationsSql = `SELECT 
                                        u.username,
                                        u.profile_photo, 
                                        n.* 
                                      FROM 
                                        notifications n 
                                        INNER JOIN users u ON u.id = JSON_UNQUOTE(
                                          JSON_EXTRACT(n.content, '$.senderId')
                                        ) 
                                      WHERE 
                                        receiverId = ? 
                                      AND 
                                        TYPE = "comment"
                                      AND
                                        is_hidden = 0`;

    const [notifications, commentNotifications] = await Promise.all([
      returnFromRaw(notificationsSql, [userId]),
      returnFromRaw(commentNotificationsSql, [userId]),
    ]);

    const notificationsMerged = [
      ...notifications,
      ...commentNotifications,
    ].sort((a, b) => {
      return new Date(b.createdAt) - new Date(a.createdAt);
    });

    res.status(200).json(notificationsMerged);
  } catch (error) {
    next(error);
  }
};

export const markNotificationsAsRead = async (req, res, next) => {
  try {
    const userId = req.session.passport.user;
    const unReadNotificationsSql = `UPDATE 
                                        notifications
                                      SET 
                                        is_read = 1
                                      WHERE 
                                        receiverId = ?`;

    await returnFromRaw(unReadNotificationsSql, [userId], QueryTypes.UPDATE);
    res.status(200).json({ message: "Success" });
  } catch (error) {
    next(error);
  }
};

export const hideNotifications = async (req, res, next) => {
  try {
    const userId = req.session.passport.user;
    const result = validationResult(req);

    if (!result.isEmpty()) throw new Error(result.array()[0].msg);

    const { id } = matchedData(req);
    const updateNotificationsSql = `UPDATE 
                                        notifications
                                    SET 
                                      is_hidden = 1
                                    WHERE 
                                      receiverId = ?
                                    AND 
                                      id = ?`;

    await returnFromRaw(
      updateNotificationsSql,
      [userId, id],
      QueryTypes.UPDATE
    );

    res.status(200).json({ message: "The notification has been hidden" });
  } catch (error) {
    next(error);
  }
};

export const getReaderProfiles = async (req, res, next) => {
  //^ Gets bookId and returns book readers based
  //^ on q which colud be Read, Did not finished,
  //^ Finished,Currently reading.

  try {
    const result = validationResult(req);

    if (!result.isEmpty()) throw new Error(result.array()[0].msg);

    const { bookId, q: qParam } = matchedData(req);
    const q = !qParam ? "Read" : qParam.replaceAll("-", " ");
    let readerProfilesSql;
    let replacements = [];

    if ((q && q !== "Liked") || !q) {
      readerProfilesSql = `SELECT 
                              userId, 
                              a.username, 
                              a.firstname, 
                              a.lastname, 
                              a.profile_photo, 
                              book_read 
                            FROM 
                              users a 
                              INNER JOIN (
                                SELECT 
                                  userId, 
                                  COUNT(
                                    CASE WHEN reading_state = "Read" THEN 1 END
                                  ) AS book_read 
                                FROM 
                                  book_reading_states 
                                WHERE 
                                  userId IN (
                                    SELECT 
                                      userId 
                                    FROM 
                                      book_reading_states 
                                    WHERE 
                                      reading_state = ? 
                                      AND bookId = ?
                                  ) 
                                GROUP BY 
                                  userId
                              ) b ON b.userId = a.id
                            `;
      replacements = [q, bookId];
    } else if (q && q === "Liked") {
      readerProfilesSql = `SELECT 
                              a.userId, 
                              c.username, 
                              c.firstname, 
                              c.lastname, 
                              c.profile_photo, 
                              COUNT(
                                CASE WHEN reading_state = "Read" THEN 1 END
                              ) AS book_read 
                            FROM 
                              (
                                SELECT 
                                  * 
                                FROM 
                                  liked_books 
                                WHERE 
                                  is_liked = 1 
                                  AND bookId = ?
                              ) a 
                              LEFT JOIN book_reading_states b ON b.userId = a.userId 
                              INNER JOIN users c ON c.id = a.userId 
                            GROUP BY 
                              a.userId
                            `;
      replacements = [bookId];
    }

    const readerProfiles = await returnFromRaw(readerProfilesSql, replacements);
    res.status(200).json({
      readerProfiles,
    });
  } catch (error) {
    next(error);
  }
};

export const displayReaderProfile = async (req, res, next) => {
  try {
    const result = validationResult(req);

    if (!result.isEmpty()) throw new Error(result.array()[0].msg);

    const { username } = matchedData(req);
    const readerSql = `
      SELECT 
        u.username, 
        u.firstname, 
        u.lastname,
        u.DOB, 
        u.gender, 
        u.profile_photo, 
        u.background_photo, 
        u.createdAt, 
        u.updatedAt, 
        COUNT(p.id) AS post_count,
        SUM(CASE WHEN p.post_type = 'thought' THEN 1 ELSE 0 END) AS thought_count,
        SUM(CASE WHEN p.post_type = 'review' THEN 1 ELSE 0 END) AS review_count,
        SUM(CASE WHEN p.post_type = 'quote' THEN 1 ELSE 0 END) AS quote_count,
        MAX(s.customer_id) AS customer_id,
        MAX(u.createdAt) createdAt
      FROM 
        users u 
        LEFT JOIN posts p ON p.userId = u.id 
        AND post_type != "comment"
        AND is_restricted = 0
        LEFT JOIN subscriptions s ON s.userId = u.id 
        AND s.status = "active" 
      WHERE 
        u.username = ?`;
    const reader = await returnFromRaw(readerSql, [username]);

    if (!reader) {
      throw new Error(`User not found`);
    }

    res.status(200).json(reader);
  } catch (error) {
    next(error);
  }
};

export const filterReaderBooks = async (req, res, next) => {
  //^ Gets all queries.q isnt optional which could be either
  //^ Read, Currently reading, Liked, Want to read or Did not finish
  //^ Based on q, it gets all the books with their reader and overall rating
  //^ sort query is either 1,2 or 3.It is to define order by clause with querySort object
  //^ querySort object but it is optional.
  //^ readerBookOrderByStmt and readerBookWhereStmt are only for readerBooksSql.

  try {
    const result = validationResult(req);
    const querySort = {
      Title: ["title", "ASC"],
      "Published Date": ["published_date", "DESC"],
      "Page Count": ["page_count", "DESC"],
    };
    let tableParam;
    let whereParam;
    let readerBookWhereStmt;

    if (!result.isEmpty()) throw new Error(result.array()[0].msg);

    const { q, sort, category, author, year, username } = matchedData(req);

    const user = await User.findOne({ where: { username } });

    if (!user) {
      throw new Error(`User not found`);
    }

    if (q == "Liked") {
      tableParam = "liked_books";
      whereParam = "is_liked = '1'";
    } else {
      tableParam = "book_reading_states";
      whereParam = `reading_state = "${q}"`;
    }

    readerBookWhereStmt = `WHERE ${whereParam} AND a.userId=${
      user.toJSON().id
    }`;
    const readerBookOrderByStmt = sort
      ? `ORDER BY f.${querySort[sort][0]} ${querySort[sort][1]}`
      : "";

    if (category) {
      readerBookWhereStmt += ` AND h.category= "${category}"`;
    } else if (author) {
      readerBookWhereStmt += ` AND d.author= "${author}"`;
    } else if (year && year != "All times") {
      readerBookWhereStmt += ` AND YEAR(a.createdAt)= "${year}"`;
    }

    const readerBooksSql = `SELECT 
                                f.id, 
                                a.userId AS userId, 
                                MAX(f.book_key) AS book_key, 
                                CASE WHEN MAX(
                                  LENGTH(f.title)
                                ) > 100 THEN CONCAT(
                                  SUBSTRING(
                                    MAX(f.title), 
                                    1, 
                                    100
                                  ), 
                                  '...'
                                ) ELSE MAX(f.title) END AS truncatedTitle, 
                                MAX(f.title) AS title, 
                                MAX(f.thumbnail) AS thumbnail, 
                                GROUP_CONCAT(
                                  DISTINCT e.publisher SEPARATOR ', '
                                ) AS publishers, 
                                MAX(c.publisherId) AS publisher_id, 
                                GROUP_CONCAT(DISTINCT d.author SEPARATOR ', ') AS authors 
                              FROM 
                                ${tableParam} a 
                                INNER JOIN author_book_association b ON b.bookId = a.bookId 
                                INNER JOIN publisher_book_association c ON c.bookId = a.bookId 
                                INNER JOIN AUTHORS d ON d.id = b.authorId 
                                INNER JOIN publishers e ON e.id = c.publisherId 
                                INNER JOIN category_book_association g ON g.bookId = a.bookId 
                                INNER JOIN categories h ON h.id = g.categoryId 
                                INNER JOIN book_collections f ON f.id = a.bookId 
                              ${readerBookWhereStmt} 
                              GROUP BY 
                                f.id 
                              ${readerBookOrderByStmt}
                                              `;
    const booksPerCategorySql = `SELECT 
                                    MAX(c.id) AS categoryId, 
                                    MAX(a.bookId) AS bookId, 
                                    MAX(c.category) AS category, 
                                    COUNT(c.id) AS "quantity" 
                                  FROM 
                                    ${tableParam} a 
                                    INNER JOIN category_book_association b ON a.bookId = b.bookId 
                                    INNER JOIN categories c ON c.id = b.categoryId 
                                  WHERE 
                                    ${whereParam} 
                                    AND userId = ${user.toJSON().id} 
                                  GROUP BY 
                                    c.id
                                  `;

    const booksPerAuthorSql = `SELECT 
                                MAX(c.id) AS authorId, 
                                MAX(a.bookId) AS bookId, 
                                MAX(c.author) AS author, 
                                COUNT(c.id) AS "quantity" 
                              FROM 
                                ${tableParam} a 
                                INNER JOIN author_book_association b ON a.bookId = b.bookId 
                                INNER JOIN AUTHORS c ON c.id = b.authorId 
                              WHERE 
                                ${whereParam} 
                                AND userId = ${user.toJSON().id} 
                              GROUP BY 
                                c.id
                              `;

    const bookRatingsSql = `SELECT 
                              a.bookId, 
                              MAX(rb.rating) user_rating, 
                              ROUND(
                                AVG(rb2.rating), 
                                1
                              ) rating 
                            FROM 
                              ${tableParam} a 
                              INNER JOIN book_collections f ON f.id = a.bookId 
                              LEFT JOIN rated_books rb ON rb.bookId = a.bookId 
                              AND rb.userId = ${user.toJSON().id} 
                              LEFT JOIN rated_books rb2 ON rb2.bookId = a.bookId 
                            WHERE 
                              ${whereParam} 
                              AND a.userId = ${user.toJSON().id} 
                            GROUP BY 
                              a.bookId
                                          `;
    const readerBooksMerged = [];
    const [readerBooks, booksPerAuthor, booksPerCategory, bookRatings] =
      await Promise.all([
        returnFromRaw(readerBooksSql),
        returnFromRaw(booksPerAuthorSql),
        returnFromRaw(booksPerCategorySql),
        returnFromRaw(bookRatingsSql),
      ]);

    if (readerBooks.length != 0) {
      const bookRatingsMap = bookRatings.reduce((acc, curr) => {
        acc[curr.bookId] = {
          reader_rating: curr.user_rating,
          overall_rating: curr.rating,
        };
        return acc;
      }, {});

      for (let x of readerBooks) {
        readerBooksMerged.push({ ...x, ...bookRatingsMap[x.id] });
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

export const getReaderReviews = async (req, res, next) => {
  try {
    const result = validationResult(req);

    if (!result.isEmpty()) throw new Error(result.array()[0].msg);

    const { username } = matchedData(req);
    const user = await User.findOne({
      where: {
        username: username,
      },
    });

    if (!user) {
      throw new Error("User not found");
    }

    const reviewsSql = `
      SELECT
        MAX(p.id) id,
        MAX(p.post_type) AS TYPE,
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
        MAX(top.topic) topic, 
        MAX(top.image) AS topic_image, 
        MAX(p.comment_count) AS comment_count, 
        bc.people_read, 
        bc.title AS book_title, 
        CASE WHEN MAX(
          LENGTH(bc.title)
        ) > 50 THEN CONCAT(
          SUBSTRING(
            bc.title, 
            1, 
            50
          ), 
          '...'
        ) ELSE bc.title END AS truncated_title, 
        bc.thumbnail, 
        bc.published_date, 
        r.createdAt 
      FROM 
        reviews r 
        LEFT JOIN book_collections bc ON r.bookId = bc.id  
        INNER JOIN users u ON u.id = r.userId 
        LEFT JOIN rated_books rb ON rb.bookId = r.bookId 
        AND rb.userId = r.userId 
        LEFT JOIN book_reading_states brs ON brs.bookId = r.bookId 
        AND brs.userId = r.userId 
        LEFT JOIN liked_books lb ON lb.bookId = r.bookId 
        AND lb.userId = r.userId 
        LEFT JOIN topics top ON r.topicId = top.id 
        INNER JOIN posts p ON p.postId = r.id 
        AND p.post_type = "review"
        AND is_restricted = 0
      WHERE 
        r.userId = ? 
      GROUP BY 
        p.id
      ORDER BY
        r.createdAt DESC
    `;

    const readerReviews = await returnFromRaw(reviewsSql, [user.toJSON().id]);
    res.status(200).json({
      readerReviews,
    });
  } catch (error) {
    next(error);
  }
};

export const getReaderQuotes = async (req, res, next) => {
  try {
    const result = validationResult(req);

    if (!result.isEmpty()) throw new Error(result.array()[0].msg);
    const { username } = matchedData(req);
    const user = await User.findOne({
      attributes: ["id"],
      where: {
        username: username,
      },
    });

    if (!user) {
      throw new Error("User not found");
    }

    const quotesSql = `
      SELECT 
        MAX(p.id) id,
        MAX(p.post_type) AS type,
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
        MAX(top.topic) topic, 
        MAX(top.image) AS topic_image,
        bc.title AS book_title, 
        CASE WHEN MAX(
          LENGTH(bc.title)
        ) > 50 THEN CONCAT(
          SUBSTRING(
            bc.title, 
            1, 
            50
          ), 
          '...'
        ) ELSE bc.title END AS truncated_title,
        bc.thumbnail, 
        bc.published_date,
        q.createdAt 
      FROM 
        quotes q 
        LEFT JOIN book_collections bc ON q.bookId = bc.id  
        LEFT JOIN topics top ON q.topicId = top.id
        INNER JOIN users u ON u.id = q.userId
        INNER JOIN posts p ON p.postId = q.id
        AND p.post_type = "quote"
        AND is_restricted = 0
      WHERE q.userId = ?
      GROUP BY 
        q.id
      ORDER BY 
        q.createdAt DESC
    `;

    const readerQuotes = await returnFromRaw(quotesSql, [user.toJSON().id]);

    res.status(200).json({
      readerQuotes,
    });
  } catch (error) {
    next(error);
  }
};

export const getReaderThoughts = async (req, res, next) => {
  try {
    const result = validationResult(req);

    if (!result.isEmpty()) throw new Error(result.array()[0].msg);
    const { username } = matchedData(req);

    const user = await User.findOne({
      attributes: ["id"],
      where: {
        username: username,
      },
    });

    if (!user) {
      throw new Error("User not found");
    }

    const thoughtsSql = `
      SELECT 
        p.id id,
        p.post_type AS TYPE, 
        t.title thought_title, 
        t.thought thought, 
        p.comment_count comment_count, 
        bc.title title, 
        CASE WHEN LENGTH(
          bc.title
        ) > 50 THEN CONCAT(
          SUBSTRING(
            bc.title, 
            1, 
            50
          ), 
          '...'
        ) ELSE bc.title END AS truncated_title, 
        top.topic topic, 
        top.image AS topic_image, 
        u.username username, 
        u.firstname firstname, 
        u.lastname lastname, 
        u.profile_photo profile_photo, 
        t.createdAt 
      FROM 
        thoughts t 
        LEFT JOIN book_collections bc ON t.bookId = bc.id 
        LEFT JOIN topics top ON t.topicId = top.id 
        JOIN users u ON t.userId = u.id 
        JOIN posts p ON p.postId = t.id 
        AND p.post_type = "thought"
        AND is_restricted = 0   
      WHERE 
        t.userId = ?
      ORDER BY 
        t.createdAt DESC 
    `;
    const thoughts = await returnFromRaw(thoughtsSql, [user.toJSON().id]);

    res.status(200).json({ thoughts });
  } catch (err) {
    next(err);
  }
};

export const updateReaderBookDates = async (req, res, next) => {
  try {
    const userId = req.session.passport.user;
    const result = validationResult(req);

    if (!result.isEmpty()) throw new Error(result.array()[0].msg);

    const { bookId, startingDate, finishingDate } = matchedData(req);

    await BookReadingState.update(
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

export const updateReaderPageNumber = async (req, res, next) => {
  try {
    const userId = req.session.passport.user;
    const result = validationResult(req);

    if (!result.isEmpty()) throw new Error(result.array()[0].msg);

    const { bookId, pageNumber } = matchedData(req);

    await BookReadingState.update(
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

export const uploadImage = async (req, res, next) => {
  //^ Gets image, saves its name to the db and deletes the previous one
  //^ from public folder if exists
  try {
    const userId = req.session.passport.user;
    const filePath = "../client/public/Pps_and_Bgs";
    let imageValues = [];
    let imageColumnName;

    for (const key in req.files) {
      imageValues = req.files[key];
    }

    imageColumnName =
      imageValues[0].fieldname == "ppImage"
        ? "profile_photo"
        : "background_photo";

    const userImage = (
      await User.findOne({
        attributes: [imageColumnName],
        where: {
          id: userId,
        },
      })
    ).toJSON();

    if (userImage[imageColumnName] != null) {
      if (fs.existsSync(filePath)) {
        fs.rm(filePath + `/${userImage[imageColumnName]}`, (err) => {
          if (err) {
            throw new Error("No such image exists");
          }
        });
      } else {
        throw new Error("No such file exists");
      }
    }

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
    res.status(200).json({
      message: "success",
      image: imageValues[0].filename,
    });
  } catch (error) {
    next(error);
  }
};

export const getReaderBookshelfOverview = async (req, res, next) => {
  //^ initializes placeholder data for monthly reads and updates it
  //^ with actual results from the database.
  try {
    const result = validationResult(req);

    if (!result.isEmpty()) {
      throw new Error(result.array()[0].msg);
    }

    const { username } = matchedData(req);
    const user = await User.findOne({
      attributes: ["id"],
      where: {
        username: username,
      },
    });

    if (!user) {
      throw new Error("User not found");
    }
    let yearlyReadBooks = [];

    Array.from({ length: 12 }, (_, i) => {
      yearlyReadBooks.push({
        MONTH: new Date(0, i).toLocaleString("en-US", { month: "short" }),
        quantity: 100,
      });
    });

    const yearlyReadBooksSql = `SELECT 
                                  MAX(
                                    DATE_FORMAT(finishing_date, '%b')
                                  ) AS MONTH, 
                                  COUNT(*) AS "quantity" 
                                FROM 
                                  book_reading_states 
                                WHERE 
                                  reading_state = "Read" 
                                  AND userId = ? 
                                  AND YEAR(finishing_date)= YEAR(
                                    CURDATE()
                                  ) 
                                GROUP BY 
                                  MONTH(finishing_date)
                                `;
    const readBooksPerAuthorSql = `SELECT 
                                      MAX(c.id) AS authorId, 
                                      MAX(a.bookId) AS bookId, 
                                      MAX(c.author) AS author, 
                                      COUNT(c.id) AS "quantity" 
                                    FROM 
                                      book_reading_states a 
                                      INNER JOIN author_book_association b ON a.bookId = b.bookId 
                                      INNER JOIN AUTHORS c ON c.id = b.authorId 
                                    WHERE 
                                      reading_state = "Read" 
                                      AND userId = ? 
                                    GROUP BY 
                                      c.id
                                  `;
    const readBooksPerCategorySql = `SELECT 
                                        MAX(c.id) AS categoryId, 
                                        MAX(a.bookId) AS bookId, 
                                        MAX(c.category) AS category, 
                                        COUNT(c.id) AS "quantity" 
                                      FROM 
                                        book_reading_states a 
                                        INNER JOIN category_book_association b ON a.bookId = b.bookId 
                                        INNER JOIN categories c ON c.id = b.categoryId 
                                      WHERE 
                                        reading_state = "Read" 
                                        AND userId = ? 
                                      GROUP BY 
                                        c.id
                                      `;
    let [yearlyReadBooksData, readBooksPerAuthor, readBooksPerCategory] =
      await Promise.all([
        returnFromRaw(yearlyReadBooksSql, [user.toJSON().id]),
        returnFromRaw(readBooksPerAuthorSql, [user.toJSON().id]),
        returnFromRaw(readBooksPerCategorySql, [user.toJSON().id]),
      ]);

    yearlyReadBooksData = new Map(
      yearlyReadBooksData.map((element) => [element.MONTH, element["quantity"]])
    );
    for (let element of yearlyReadBooks) {
      if (yearlyReadBooksData.has(element.MONTH)) {
        element.quantity = yearlyReadBooksData.get(element.MONTH);
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

export const getLoggedInReader = async (req, res, next) => {
  try {
    const userId = req.session.passport.user;
    const userSql = `SELECT 
                        u.id, 
                        u.username, 
                        u.firstname, 
                        u.lastname, 
                        u.profile_photo, 
                        MAX(s.customer_id) customer_id,
                        MAX(s.createdAt) 
                      FROM 
                        users u 
                        LEFT JOIN subscriptions s ON s.userId = u.id 
                        AND s.status = "active"
                      WHERE 
                        u.id = ? 
                      GROUP BY 
                        u.id`;
    const unReadNotificationsSql = `SELECT COUNT(*) unread
                                    FROM 
                                      notifications
                                    WHERE 
                                      is_read = 0
                                    AND 
                                      receiverId = ?`;
    const [user, unReadNotifications] = await Promise.all([
      returnFromRaw(userSql, [userId]),
      returnFromRaw(unReadNotificationsSql, [userId]),
    ]);

    if (!user) {
      throw new Error("User not found");
    }

    res.status(200).json({ user, unReadNotifications });
  } catch (error) {
    next(error);
  }
};

export const getReaderPostComments = async (req, res, next) => {
  //^ Gets reader's comments depending on postType.
  //^ postId is the pk in posts table so the fk
  //^ for the post could be found
  try {
    const result = validationResult(req);
    let comments, post;

    if (!result.isEmpty()) {
      throw new Error(result.array()[0].msg);
    }

    const { postType, postId } = matchedData(req);
    const userId = req.session.passport.user;
    const user = await User.findByPk(userId, {
      attributes: ["profile_photo"],
    });
    const pkPostId = await Post.findOne({
      attributes: ["postId"],
      where: {
        id: postId,
        post_type: postType,
      },
    });

    if (!pkPostId) {
      throw new Error("Post id not found");
    }

    const commentsSql = `SELECT 
                            p.id, 
                            c.comment, 
                            p.comment_count, 
                            c.createdAt, 
                            c.userId, 
                            u.username, 
                            u.firstname, 
                            u.lastname 
                          FROM 
                            comments c 
                            INNER JOIN posts p ON c.id = p.postId 
                            AND p.post_type = "comment"
                            AND is_restricted = 0 
                            INNER JOIN users u ON u.id = c.userId 
                          WHERE 
                            c.commentToId = ?
                          `;

    if (postType == "review") {
      post = `SELECT 
                p.id, 
                r.bookId, 
                r.title, 
                r.review, 
                r.createdAt, 
                (
                  SELECT 
                    GROUP_CONCAT(
                      DISTINCT Publishers.publisher SEPARATOR ', '
                    ) 
                  FROM 
                    Publisher_Book_Association pba 
                    JOIN Publishers ON pba.publisherId = Publishers.id 
                  WHERE 
                    pba.bookId = bc.id
                ) publishers, 
                (
                  SELECT 
                    GROUP_CONCAT(
                      DISTINCT Authors.author SEPARATOR ', '
                    ) 
                  FROM 
                    Author_Book_Association aut 
                    JOIN AUTHORS ON aut.authorId = Authors.id 
                  WHERE 
                    aut.bookId = bc.id
                ) AUTHORS, 
                u.username username, 
                u.firstname firstname, 
                u.lastname lastname, 
                u.profile_photo profile_photo, 
                bc.thumbnail thumbnail, 
                bc.published_date published_date, 
                CASE WHEN LENGTH(bc.title) > 100 THEN CONCAT(
                  SUBSTRING(bc.title, 1, 100), 
                  '...'
                ) ELSE bc.title END AS truncated_title, 
                p.comment_count, 
                t.topic topic, 
                t.image topic_image 
              FROM 
                Reviews r 
                JOIN users u ON r.userId = u.id 
                JOIN book_Collections bc ON r.bookId = bc.id 
                LEFT JOIN topics t ON r.topicId = t.id 
                JOIN posts p ON p.postId = r.id 
                AND p.id = ? 
                AND p.post_type = "review"
                AND is_restricted = 0
              `;
    } else if (postType == "quote") {
      post = `SELECT 
                p.id, 
                q.bookId, 
                q.title, 
                q.quote, 
                q.page, 
                q.createdAt, 
                (
                  SELECT 
                    GROUP_CONCAT(
                      DISTINCT Publishers.publisher SEPARATOR ', '
                    ) 
                  FROM 
                    Publisher_Book_Association AS pba 
                    JOIN Publishers ON pba.publisherId = Publishers.id 
                  WHERE 
                    pba.bookId = bc.id
                ) AS publishers, 
                (
                  SELECT 
                    GROUP_CONCAT(
                      DISTINCT Authors.author SEPARATOR ', '
                    ) 
                  FROM 
                    Author_Book_Association AS aut 
                    JOIN AUTHORS ON aut.authorId = Authors.id 
                  WHERE 
                    aut.bookId = bc.id
                ) AS AUTHORS, 
                u.username AS username, 
                u.firstname AS firstname, 
                u.lastname AS lastname, 
                u.profile_photo AS profile_photo, 
                bc.thumbnail AS "bc.thumbnail", 
                bc.published_date AS "bc.published_date", 
                CASE WHEN LENGTH(bc.title) > 100 THEN CONCAT(
                  SUBSTRING(bc.title, 1, 100), 
                  '...'
                ) ELSE bc.title END AS "bc.truncated_title", 
                p.comment_count, 
                top.topic AS topic, 
                top.image AS topic_image 
              FROM 
                Quotes AS q 
                JOIN Users AS u ON q.userId = u.id 
                JOIN Book_Collections AS bc ON q.bookId = bc.id 
                LEFT JOIN Topics AS top ON q.topicId = top.id 
                JOIN posts p ON p.postId = q.id 
                AND p.id = ? 
                AND p.post_type = "quote"
                AND is_restricted = 0
              `;
    } else if (postType == "thought") {
      post = `SELECT 
                p.id, 
                t.title, 
                t.thought, 
                t.createdAt,
                u.username AS username, 
                u.firstname AS firstname, 
                u.lastname AS lastname, 
                u.profile_photo AS profile_photo, 
                p.comment_count, 
                top.topic AS topic, 
                top.image AS topic_image 
              FROM 
                Thoughts AS t 
                JOIN Users AS u ON t.userId = u.id 
                LEFT JOIN Topics AS top ON t.topicId = top.id 
                JOIN posts p ON p.postId = t.id 
                AND p.id =  ? 
                AND p.post_type = "thought"
                AND is_restricted = 0
              `;
    } else {
      post = `SELECT 
                p.id,
                c.comment,
                p.comment_count, 
                c.createdAt, 
                c.commentToId, 
                c.userId, 
                u.username, 
                u.firstname, 
                u.lastname, 
                u.profile_photo 
              FROM 
                Comments AS c 
                JOIN Users AS u ON c.userId = u.id
                JOIN posts p ON p.postId = c.id 
                AND p.id = ? 
                AND p.post_type = "comment"
                AND is_restricted = 0
              `;
    }

    [post] = await returnFromRaw(post, [postId]);
    comments = await returnFromRaw(commentsSql, [postId]);
    res.status(200).json({
      post,
      comments,
      user,
    });
  } catch (error) {
    next(error);
  }
};

export const sendComment = async (req, res, next) => {
  //^ Gets comment, post being commented on and postType
  //^ to define what post it is.
  //^ Predefines the comments sql to update the comments list
  //^ after creating and updating
  //^ Checks the post being commented on, it could be a rootParent
  //^ which is quote,review,thought or just a comment.
  //^ If the post being commented is not a comment,it creates a
  //^ new comment with the rootParent id being the id of the post at
  //^ the beginning. If its not, it finds the comment being commented
  //^ on, then creates a new comment with the rootParent id of the
  //^ comment being commented on.
  //^ It updated the post comment count and get the updated comment
  //^ list

  const t = await sequelize.transaction();
  try {
    const result = validationResult(req);

    if (!result.isEmpty()) {
      throw new Error(result.array()[0].msg);
    }

    const { comment, commentToId, postType } = matchedData(req);
    const userId = req.session.passport.user;
    const commentsSql = `SELECT 
                            p.id, 
                            c.comment, 
                            p.comment_count, 
                            c.createdAt, 
                            c.userId, 
                            u.username, 
                            u.firstname, 
                            u.lastname 
                          FROM 
                            comments c 
                            INNER JOIN posts p ON c.id = p.postId 
                            AND p.post_type = "comment" 
                            AND is_restricted = 0
                            INNER JOIN users u ON u.id = c.userId 
                          WHERE 
                            c.commentToId = ?
                          `;

    const post = await Post.findOne({
      where: {
        id: commentToId,
      },
    });

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
          receiverId: post.userId,
        },
        { transaction: t }
      );
    } else {
      const commentPost = await Comment.findOne({
        where: {
          id: post.postId,
        },
      });

      if (!commentPost) throw new Error("Comment post not found");

      await Comment.create(
        {
          comment: comment,
          commentToId: post.id,
          rootParentId: commentPost.rootParentId,
          userId: userId,
          receiverId: commentPost.userId,
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

    const comments = await returnFromRaw(commentsSql, [commentToId]);

    res.status(200).json({
      comments,
    });
  } catch (error) {
    await t.rollback();
    next(error);
  }
};

export const getReaderComments = async (req, res, next) => {
  //^ Gets index -offset- and username from url and
  //^ returns reader's all comments from database with offset and
  //^ username.
  try {
    const result = validationResult(req);

    if (!result.isEmpty()) {
      throw new Error(result.array()[0].msg);
    }

    const { index, username } = matchedData(req);
    const user = await User.findOne({ where: { username } });

    if (!user) {
      throw new Error("User not found");
    }

    const commentsSql = `
      SELECT 
        t.*, 
        p.post_type, 
        u.username receiver_username 
      FROM 
        posts p 
        INNER JOIN (
          SELECT 
            p.id, 
            c.comment, 
            p.comment_count, 
            c.commentToId, 
            c.userId, 
            us.firstname sender_firstname, 
            us.lastname sender_lastname, 
            us.username sender_username, 
            us.profile_photo, 
            c.receiverId, 
            c.createdAt 
          FROM 
            comments c 
            INNER JOIN users us ON us.id = c.userId 
            INNER JOIN posts p ON p.postId = c.id 
            AND p.post_type = "comment" 
            AND is_restricted = 0
          WHERE 
            us.username = ? 
            AND us.id = c.userId
        ) AS t ON t.commentToId = p.id 
        INNER JOIN users u ON t.receiverId = u.id
            LIMIT
              5 
            OFFSET 
              ${index}
    `;

    const comments = await returnFromRaw(commentsSql, [username]);

    res.status(200).json({
      comments,
    });
  } catch (error) {
    next(error);
  }
};

export const getThemedTopics = async (req, res, next) => {
  try {
    const result = validationResult(req);
    const userId = req.session.passport.user;

    if (!result.isEmpty()) throw new Error(result.array()[0].msg);

    const { category } = matchedData(req);
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
                              topicCategoryId = ?;
                            `;
    const themedTopics = await returnFromRaw(themedTopicsSql, [
      topicCategory.id,
    ]);

    res.status(200).json(themedTopics);
  } catch (error) {
    next(error);
  }
};

export const createTopic = async (req, res, next) => {
  //^ Gets body from request, finds topic category
  //^ and loops through them to create topic
  //^ association
  const t = await sequelize.transaction();
  try {
    const colorList = ["#095109", "#000", "#710c0c", "#875802", "#00006d"];
    const image = colorList[Math.floor(Math.random() * colorList.length)];
    const result = validationResult(req);

    if (!result.isEmpty()) throw new Error(result.array()[0].msg);

    const { topic, category } = matchedData(req);
    const topicCategory = await TopicCategory.findAll({
      where: {
        topic_category: category,
      },
    });

    if (!topicCategory) throw new Error("Topic category not found");

    const topicCategoryIds = topicCategory.map((i) => i.id);
    const newTopic = (
      await Topic.create(
        {
          topic: topic,
          image: image,
        },
        { transaction: t }
      )
    ).toJSON();

    const sql = `INSERT INTO topic_category_association (createdAt,updatedAt,TopicId,topicCategoryId)
                VALUES (NOW(), NOW(), ?, ?);`;
    const queries = topicCategoryIds.map((element) =>
      sequelize.query(sql, {
        replacements: [newTopic.id, element],
        transaction: t,
      })
    );

    await Promise.all(queries);
    await t.commit();

    res.status(200).json({
      success: "Topic created",
    });
  } catch (error) {
    // await t.rollback();
    next(error);
  }
};

export const getTopic = async (req, res, next) => {
  //^ Gets topic, counts its followersand returns as
  //^ merged
  try {
    const result = validationResult(req);
    const userId = req.session.passport.user;

    if (!result.isEmpty()) {
      throw new Error(result.array()[0].msg);
    }

    const { topicName } = matchedData(req);

    let topic = await Topic.findOne({
      where: {
        topic: topicName,
      },
      raw: true,
    });

    if (!topic) {
      throw new Error("Topic not found");
    }

    const topicSql = `
      SELECT 
        t.*,
        CASE 
          WHEN uta.UserId IS NOT NULL THEN 1
          ELSE 0
        END AS isFollowing
      FROM topics t
      LEFT JOIN user_topic_association uta 
        ON uta.UserId = ? AND uta.TopicId = t.id
      WHERE t.topic = ?;
    `;

    topic = await returnFromRaw(topicSql, [userId, topicName]);
    res.status(200).json(topic);
  } catch (error) {
    next(error);
  }
};

export const getTopicBooks = async (req, res, next) => {
  //^ Gets topic, and finds any related books -review,
  //^ quote, thought- to it
  try {
    const result = validationResult(req);

    if (!result.isEmpty()) throw new Error(result.array()[0].msg);
    const { topicName } = matchedData(req);
    const topic = await Topic.findOne({
      where: {
        topic: topicName,
      },
      raw: true,
    });

    if (!topic) {
      throw new Error("Topic not found");
    }

    const topicBooksSql = ` SELECT 
                                t.*, 
                                tba.BookCollectionId
                              FROM 
                                topics t
                              INNER JOIN 
                                topic_book_associations tba 
                              ON 
                                t.id = tba.TopicId
                              INNER JOIN 
                                book_collections bc 
                              ON 
                                tba.BookCollectionId = bc.id
                              WHERE 
                                tba.TopicId = ?
                                `;
    const topicBooks = await returnFromRaw(topicBooksSql, [topic.id]);

    const topicBookIds = topicBooks.map((item) => item.BookCollectionId);
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

    res.status(200).json({ books, bookPageCounts });
  } catch (error) {
    next(error);
  }
};

export const getTopicPosts = async (req, res, next) => {
  //^ Gets topic, and finds any related posts -review,
  //^ quote, thought- to it
  try {
    const jsonDict = {};
    const result = validationResult(req);
    let posts;

    if (!result.isEmpty()) {
      return res.status(400).json({ error: result.array() });
    }

    let { index: offset, sortBy, topicName, q } = matchedData(req);
    const limit = 20;

    sortBy = sortBy == "oldest" ? "ASC" : "DESC";

    const topic = await Topic.findOne({
      attributes: ["id"],
      where: {
        topic: topicName,
      },
      raw: true,
    });

    if (!topic) throw new Error("Topic not found");

    const reviewsSql = `
      SELECT
        MAX(p.id) id,
        MAX(p.post_type) AS type,
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
        MAX(top.topic) topic, 
        MAX(top.image) AS topic_image, 
        MAX(p.comment_count) AS comment_count, 
        bc.people_read, 
        bc.title AS book_title, 
        CASE WHEN MAX(
          LENGTH(bc.title)
        ) > 50 THEN CONCAT(
          SUBSTRING(
            bc.title, 
            1, 
            50
          ), 
          '...'
        ) ELSE bc.title END AS truncated_title, 
        bc.thumbnail, 
        bc.published_date, 
        r.createdAt 
      FROM 
        reviews r 
        LEFT JOIN book_collections bc ON r.bookId = bc.id  
        INNER JOIN users u ON u.id = r.userId 
        LEFT JOIN rated_books rb ON rb.bookId = r.bookId 
        AND rb.userId = r.userId 
        LEFT JOIN book_reading_states brs ON brs.bookId = r.bookId 
        AND brs.userId = r.userId 
        LEFT JOIN liked_books lb ON lb.bookId = r.bookId 
        AND lb.userId = r.userId 
        LEFT JOIN topics top ON r.topicId = top.id 
        INNER JOIN posts p ON p.postId = r.id 
        AND p.post_type = "review"
        AND is_restricted = 0
        WHERE r.topicId = ?
      GROUP BY 
        r.id
      ORDER BY 
        r.createdAt ${sortBy}
      LIMIT ${limit} OFFSET ${offset};
    `;
    const thoughtsSql = `
      SELECT 
        p.id id,
        p.post_type AS TYPE, 
        t.title thought_title, 
        t.thought thought, 
        p.comment_count comment_count, 
        bc.title title, 
        CASE WHEN LENGTH(
          bc.title
        ) > 50 THEN CONCAT(
          SUBSTRING(
            bc.title, 
            1, 
            50
          ), 
          '...'
        ) ELSE bc.title END AS truncated_title, 
        top.topic topic, 
        top.image AS topic_image, 
        u.username username, 
        u.firstname firstname, 
        u.lastname lastname, 
        u.profile_photo profile_photo, 
        t.createdAt 
      FROM 
        thoughts t 
        LEFT JOIN book_collections bc ON t.bookId = bc.id 
        LEFT JOIN topics top ON t.topicId = top.id 
        JOIN users u ON t.userId = u.id 
        JOIN posts p ON p.postId = t.id 
        AND p.post_type = "thought"
        AND is_restricted = 0
        WHERE 
          top.id = ?   
      ORDER BY 
        t.createdAt ${sortBy}
      LIMIT ${limit} OFFSET ${offset};  
    `;
    const quotesSql = `
      SELECT 
        MAX(p.id) id,
        MAX(p.post_type) AS type,
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
        MAX(top.topic) topic, 
        MAX(top.image) AS topic_image,
        bc.title AS book_title, 
        CASE WHEN MAX(
          LENGTH(bc.title)
        ) > 50 THEN CONCAT(
          SUBSTRING(
            bc.title, 
            1, 
            50
          ), 
          '...'
        ) ELSE bc.title END AS truncated_title,
        bc.thumbnail, 
        bc.published_date,
        q.createdAt 
      FROM 
        quotes q 
        LEFT JOIN book_collections bc ON q.bookId = bc.id  
        LEFT JOIN topics top ON q.topicId = top.id
        INNER JOIN users u ON u.id = q.userId
        INNER JOIN posts p ON p.postId = q.id
        AND p.post_type = "quote"
        AND is_restricted = 0
        WHERE q.topicId = ?
      GROUP BY 
        q.id
      ORDER BY 
        q.createdAt ${sortBy}
      LIMIT ${limit} OFFSET ${offset};
    `;

    if (!q) {
      const [reviews, thoughts, quotes] = await Promise.all([
        returnFromRaw(reviewsSql, [topic.id]),
        returnFromRaw(thoughtsSql, [topic.id]),
        returnFromRaw(quotesSql, [topic.id]),
      ]);

      posts = [...reviews, ...thoughts, ...quotes];
      posts = posts.sort((a, b) => {
        return sortBy == "DESC"
          ? new Date(b.createdAt) - new Date(a.createdAt)
          : new Date(a.createdAt) - new Date(b.createdAt);
      });
    } else if (q == "review") {
      posts = await returnFromRaw(reviewsSql);
    } else if (q == "thought") {
      posts = await returnFromRaw(thoughtsSql);
    } else if (q == "quote") {
      posts = await returnFromRaw(quotesSql);
    }

    jsonDict["posts"] = posts;
    res.status(200).json(jsonDict);
  } catch (error) {
    next(error);
  }
};

export const getReaderBookModalDetails = async (req, res, next) => {
  //^ Gets bookId, and returns reader's book modal details
  //^  which are pivate note and book reading state
  try {
    const result = validationResult(req);
    const userId = req.session.passport.user;

    if (!result.isEmpty()) {
      return res.status(400).json({ error: result.array() });
    }

    const { bookId } = matchedData(req);
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

    res.status(200).json({ readerBookModalDetails });
  } catch (error) {
    next(error);
  }
};

export const getTopicReaders = async (req, res, next) => {
  //^ Gets topic, and finds any related readers
  //^ that made a post to it
  try {
    const result = validationResult(req);

    if (!result.isEmpty()) throw new Error(result.array()[0].msg);

    const { topicName } = matchedData(req);
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
    const topicReaders = await returnFromRaw(topicReadersSql);

    res.status(200).json(topicReaders);
  } catch (error) {
    next(error);
  }
};

export const getExploreGenerals = async (req, res, next) => {
  try {
    const userId = req.session.passport.user;
    const topicsSql = `
      SELECT 
        t.id, 
        t.topic, 
        t.image, 
        t.post_count, 
        t.follower_count, 
        IF(
          MAX(uta.UserId) IS NULL, 
          FALSE, 
          TRUE
        ) AS isFollowing 
      FROM 
        topics t 
        LEFT JOIN user_topic_association uta ON uta.TopicId = t.id 
        AND uta.UserId = ${userId} 
      GROUP BY 
        t.id 
      LIMIT 
        5
    `;
    const bookWormsSql = `
      SELECT 
        u.id, 
        u.username, 
        u.firstname, 
        u.lastname, 
        u.profile_photo, 
        COUNT(DISTINCT brs.id) AS books_read,
        MAX(s.customer_id) customer_id 
      FROM 
        users u 
        JOIN book_reading_states brs ON brs.userId = u.id 
        AND brs.reading_state = "Read"
        JOIN subscriptions s ON s.customer_id = u.id 
      GROUP BY 
        u.id 
      LIMIT 
        20
    `;
    const topLikedBooksSql = `
      SELECT 
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
        temp.liked_count DESC 
    `;
    const whatShallIreadSql = `
      SELECT 
        MAX(reb.id) id, 
        MAX(reb.bookId) bookId,
        COUNT(brs.reading_state) people_read, 
        ROUND(
          AVG(rb.rating), 
          1
        ) rate, 
        CASE WHEN LENGTH(
          MAX(bc.title)
        ) > 15 THEN CONCAT(
          SUBSTRING(
            MAX(bc.title), 
            1, 
            15
          ), 
          '...'
        ) ELSE MAX(bc.title) END truncatedTitle, 
        MAX(bc.title) title, 
        MAX(bc.thumbnail) thumbnail 
      FROM 
        recommended_books reb 
        JOIN book_collections bc ON reb.bookId = bc.id 
        LEFT JOIN rated_books rb ON rb.bookId = bc.id 
        AND rb.rating IS NOT NULL
        LEFT JOIN book_reading_states brs ON brs.bookId = bc.id 
        AND brs.reading_state = "Read" 
      WHERE 
        reb.userId = 6 
      GROUP BY 
        reb.bookId 
      ORDER BY 
        MAX(reb.createdAt) DESC 
      LIMIT 
        20
    `;
    const [topics, bookWorms, topLikedBooks, whatShallIread] =
      await Promise.all([
        returnFromRaw(topicsSql),
        returnFromRaw(bookWormsSql),
        returnFromRaw(topLikedBooksSql),
        returnFromRaw(whatShallIreadSql),
      ]);

    res.status(200).json({ topics, bookWorms, topLikedBooks, whatShallIread });
  } catch (error) {
    next(error);
  }
};

export const getExploreReaders = async (req, res, next) => {
  try {
    const bookWormsSql = `
      SELECT 
        u.id, 
        u.username, 
        u.firstname, 
        u.lastname, 
        u.profile_photo, 
        COUNT(DISTINCT brs.id) AS books_read,
        MAX(s.customer_id) customer_id
      FROM 
        users u 
        JOIN book_reading_states brs ON brs.userId = u.id 
        AND brs.reading_state = "Read" 
        LEFT JOIN subscriptions s ON s.userId = u.id
      GROUP BY 
        u.id 
      LIMIT 
        20
    `;
    const bookWormsPremiumSql = `
      SELECT 
        u.id, 
        u.username, 
        u.firstname, 
        u.lastname, 
        u.profile_photo, 
        COUNT(brs.id) AS books_read 
      FROM 
        users u 
        INNER JOIN (
          SELECT 
            s.userId userId, 
            MAX(s.customer_id) customer_id, 
            MAX(s.createdAt) 
          FROM 
            users u 
            JOIN subscriptions s ON s.userId = u.id 
            AND s.status = "active" 
          GROUP BY 
            u.id
        ) t ON t.userId = u.id 
        JOIN book_reading_states brs ON brs.userId = t.userId 
        AND brs.reading_state = "Read" 
      GROUP BY 
        t.userId 
      LIMIT 
        20
    `;
    const topQuotersSql = `
      SELECT 
        u.id, 
        u.username, 
        u.firstname, 
        u.lastname, 
        u.profile_photo, 
        COUNT(DISTINCT q.id) AS quote_count,
        MAX(s.customer_id) customer_id 
      FROM 
        users u 
        JOIN quotes q ON q.userId = u.id
        LEFT JOIN subscriptions s ON s.userId = u.id 
      GROUP BY 
        u.id 
      LIMIT 
        20
    `;
    const topReviewersSql = `
      SELECT 
        u.id, 
        u.username, 
        u.firstname, 
        u.lastname, 
        u.profile_photo, 
        COUNT(DISTINCT r.id) AS review_count,
        MAX(s.customer_id) customer_id 
      FROM 
        users u 
        JOIN reviews r ON r.userId = u.id
        LEFT JOIN subscriptions s ON s.userId = u.id 
      GROUP BY 
        u.id 
      LIMIT 
        20`;
    const [bookWorms, bookWormsPremium, topQuoters, topReviewers] =
      await Promise.all([
        returnFromRaw(bookWormsSql),
        returnFromRaw(bookWormsPremiumSql),
        returnFromRaw(topQuotersSql),
        returnFromRaw(topReviewersSql),
      ]);

    res
      .status(200)
      .json({ bookWorms, bookWormsPremium, topQuoters, topReviewers });
  } catch (error) {
    next(error);
  }
};

export const getExplorePopularTopics = async (req, res, next) => {
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
    const popularTopics = await returnFromRaw(popularTopicsSql);

    res.status(200).json({ trendingTopics, popularTopics });
  } catch (error) {
    next(error);
  }
};

export const getAllTopics = async (req, res, next) => {
  try {
    const topicsSql = `SELECT 
                          id "value",
                          topic label
                        FROM 
                          topics`;
    const topics = await returnFromRaw(topicsSql);

    res.status(200).json(topics);
  } catch (error) {
    next(error);
  }
};

export const getExploreBooks = async (req, res, next) => {
  try {
    const whatShallIreadSql = `
      SELECT 
        MAX(reb.id) id, 
        MAX(reb.bookId) bookId,
        COUNT(brs.reading_state) people_read, 
        ROUND(
          AVG(rb.rating), 
          1
        ) rate, 
        CASE WHEN LENGTH(
          MAX(bc.title)
        ) > 15 THEN CONCAT(
          SUBSTRING(
            MAX(bc.title), 
            1, 
            15
          ), 
          '...'
        ) ELSE MAX(bc.title) END truncatedTitle, 
        MAX(bc.title) title, 
        MAX(bc.thumbnail) thumbnail 
      FROM 
        recommended_books reb 
        JOIN book_collections bc ON reb.bookId = bc.id 
        LEFT JOIN rated_books rb ON rb.bookId = bc.id 
        AND rb.rating IS NOT NULL
        LEFT JOIN book_reading_states brs ON brs.bookId = bc.id 
        AND brs.reading_state = "Read" 
      WHERE 
        reb.userId = 6 
      GROUP BY 
        reb.bookId 
      ORDER BY 
        MAX(reb.createdAt) DESC 
      LIMIT 
        20
    `;
    const mostReadLastMonthSql = `
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
    `;
    const mostReadLastYearSql = `
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
    `;
    const mostLikedSql = `
      SELECT 
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
        lb.bookId
    `;
    const mostReadSql = `
      SELECT 
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
    const highestRatedSql = `
      SELECT 
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
        rb.bookId
    `;
    const [
      whatShallIread,
      mostRead,
      mostLiked,
      highestRated,
      mostReadLastMonth,
      mostReadLastYear,
    ] = await Promise.all([
      returnFromRaw(whatShallIreadSql),
      returnFromRaw(mostReadSql),
      returnFromRaw(mostLikedSql),
      returnFromRaw(highestRatedSql),
      returnFromRaw(mostReadLastMonthSql),
      returnFromRaw(mostReadLastYearSql),
    ]);

    res.status(200).json({
      whatShallIread,
      mostRead,
      mostLiked,
      highestRated,
      mostReadLastMonth,
      mostReadLastYear,
    });
  } catch (error) {
    next(error);
  }
};

export const getTrendingTopics = async (req, res, next) => {
  try {
    const updated = await returnFromRaw(trendingTopicsSql);
    res.status(200).json(updated);
  } catch (error) {
    next(error);
  }
};

export const getTopicCategories = async (req, res, next) => {
  try {
    let topicCategories = await TopicCategory.findAll();
    topicCategories = topicCategories.map((result) => result.toJSON());
    res.status(200).json(topicCategories);
  } catch (error) {
    next(error);
  }
};

export const setFollowingState = async (req, res, next) => {
  try {
    const userId = req.session.passport.user;
    const result = validationResult(req);

    if (!result.isEmpty()) throw new Error(result.array()[0].msg);
    const { topicId, isFollowing } = matchedData(req);

    const sqlUpdate = `INSERT INTO user_topic_association 
                        (createdAt,updatedAt,TopicId, UserId)
                        VALUES (NOW(), NOW(), ${topicId}, ${userId})`;
    const sqlDelete = `DELETE FROM user_topic_association  
                        WHERE UserId = ${userId} 
                        AND TopicId = ${topicId}
    `;

    if (isFollowing) {
      await returnFromRaw(sqlUpdate, QueryTypes.INSERT);
    } else {
      await returnFromRaw(sqlDelete, QueryTypes.DELETE);
    }

    res.status(200).json({ message: "Success" });
  } catch (error) {
    next(error);
  }
};

export const getBookCategories = async (req, res, next) => {
  try {
    const result = validationResult(req);

    if (!result.isEmpty()) {
      throw new Error(result.array()[0].msg);
    }

    const { q, index } = matchedData(req);
    const offset = index ? `OFFSET ${index}` : "OFFSET 0";
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
    const bookCategories = await returnFromRaw(bookCategoriesSql);

    res.status(200).json(bookCategories);
  } catch (error) {
    next(error);
  }
};

export const getCategoryBooks = async (req, res, next) => {
  //^ Gets categoryId and returns books related to it
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
      returnFromRaw(mostReadSql),
      returnFromRaw(mostLikedSql),
      returnFromRaw(highestRatedSql),
      returnFromRaw(mostReadLastMonthSql),
      returnFromRaw(mostReadLastYearSql),
    ]);

    res.status(200).json({
      category,
      mostRead,
      mostLiked,
      highestRated,
      mostReadLastMonth,
      mostReadLastYear,
    });
  } catch (error) {
    next(error);
  }
};

export const getSidebarTopics = async (req, res, next) => {
  try {
    const topicsSql = `
      SELECT 
        t.id,
        t.topic,
        t.image,
        t.post_count,t.follower_count
      FROM 
        topics t 
      GROUP BY
        t.id
      LIMIT 5
    `;
    const topics = await returnFromRaw(topicsSql);

    res.status(200).json(topics);
  } catch (error) {
    next(error);
  }
};

export const createCheckoutSession = async (req, res, next) => {
  try {
    const result = validationResult(req);
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

    if (!result.isEmpty()) {
      throw new Error(result.array()[0].msg);
    }

    const { premiumType } = matchedData(req);
    const userId = req.session.passport.user;
    // const prices = await stripe.prices.list({
    //   lookup_keys: [premiumType],
    // });
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
      metadata: {
        user_id: userId,
      },
      mode: "subscription",
      success_url: `${process.env.DOMAIN}/return?success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.DOMAIN}/return?canceled=true&session_id={CHECKOUT_SESSION_ID}`,
    });

    return res.send({
      url: session.url,
    });
  } catch (error) {
    next(error);
  }
};

export const listenWebhook = async (req, res, next) => {
  const signature = req.headers["stripe-signature"];
  let event, paymentIntent, sub, notification;
  if (endpointSecret) {
    try {
      event = stripe.webhooks.constructEvent(
        req.rawBody,
        signature,
        endpointSecret
      );
    } catch (err) {
      logger.log(`Webhook signature verification failed.`, err.message);
      next(err);
    }
  }

  paymentIntent = event.data.object;
  // Handle the event
  switch (event.type) {
    case "checkout.session.completed":
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
      break;

    case "checkout.session.expired":
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
      break;

    case "customer.subscription.created":
      notification = Notification.create({
        content: {
          status: "created",
          end_date: paymentIntent.current_period_end,
        },
        type: "premium",
        receiverId: paymentIntent.metadata.user_id,
      });
      sub = Subscription.create({
        start_date: paymentIntent.start_date,
        end_date: paymentIntent.current_period_end,
        interval: paymentIntent.plan.interval,
        subscription_id: paymentIntent.id,
        customer_id: paymentIntent.customer,
        product_id: paymentIntent.plan.product,
        amount_total: paymentIntent.plan.amount,
        currency: paymentIntent.plan.currency,
        status: paymentIntent.status,
        userId: paymentIntent.metadata.user_id,
      });
      await Promise.all([sub, notification]);
      break;

    case "customer.subscription.deleted":
      notification = Notification.create({
        content: {
          status: "deleted",
          end_date: paymentIntent.canceled_at,
        },
        type: "premium",
        receiverId: paymentIntent.metadata.user_id,
      });
      sub = Subscription.update(
        {
          status: paymentIntent.status,
          canceled_at: paymentIntent.canceled_at,
        },
        { where: { subscription_id: paymentIntent.id } }
      );
      await Promise.all([sub, notification]);
      break;

    case "customer.subscription.updated":
      await Subscription.update(
        { status: paymentIntent.status },
        { where: { subscription_id: paymentIntent.id } }
      );
      break;

    default:
      logger.log(`Unhandled event type ${event.type}`);
  }

  // Return a res to acknowledge receipt of the event
  return res.json({ received: true });
};

export const createCustomerPortalSession = async (req, res, next) => {
  try {
    const userId = req.session.passport.user;
    const userSubId = await Subscription.findOne({
      attributes: ["customer_id"],
      where: {
        userId,
        status: "active",
      },
    });

    if (!userSubId) {
      throw new Error("No active customer found");
    }

    const session = await stripe.billingPortal.sessions.create({
      customer: userSubId.toJSON().customer_id,
      return_url: `${process.env.DOMAIN}/home`,
    });

    res.status(200).json({ url: session.url });
  } catch (error) {
    next(error);
  }
};
