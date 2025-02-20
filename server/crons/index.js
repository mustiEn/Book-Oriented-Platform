import cron from "node-cron";
import { logger, returnRawQuery } from "../utils/constants.js";
import dotenv from "dotenv";
import { Post } from "../models/Post.js";
import { RestrictedPost } from "../models/RestrictedPost.js";
import { reviewer } from "../server.js";
import { RecommendedBook } from "../models/RecommendedBook.js";

dotenv.config();

//? RESTRICTION

const postsSql = `SELECT 
                    id, post_type, postId, userId 
                  FROM
                    posts
                  LIMIT 3`;
const returnContent = async (postType, postId) => {
  const contentSql = `SELECT ${postType}
                      FROM
                        ${postType}s
                      WHERE 
                        id = ${postId}`;
  const result = await returnRawQuery(contentSql);
  const content = result[0][postType];
  logger.log(content);
  return content;
};
const getContentSensitivity = async (text) => {
  try {
    const data = new FormData();
    data.append("text", text);
    data.append("lang", "en");
    data.append("models", "general,self-harm");
    data.append("mode", "ml");
    data.append("api_user", process.env.SIGHT_ENGINE_USER_ID);
    data.append("api_secret", process.env.SIGHT_ENGINE_SECRET_KEY);
    const response = await fetch(
      "https://api.sightengine.com/1.0/text/check.json",
      {
        method: "POST",
        body: data,
      }
    );

    if (!response.ok) {
      throw new Error(res.message);
    }
    const result = await response.json();
    return result;
  } catch (error) {
    logger.log(error);
  }
};

//? TRENDING TOPICS

export const trendingTopicsSql = `SELECT  
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
              posts p 
              INNER JOIN topics t ON t.id = p.topicId 
              LEFT JOIN user_topic_association uta ON uta.TopicId = t.id 
              AND uta.UserId = 6 
            WHERE 
              p.createdAt >= NOW() - INTERVAL 36 HOUR 
              AND p.post_type != 'comment' 
              AND p.topicId IS NOT NULL 
            GROUP BY 
              p.topicId
            LIMIT 10;`;
export let trendingTopics = await returnRawQuery(trendingTopicsSql);

// export const cronGetTrendingTopics = cron.schedule("* */1 * * *", async () => {
//   trendingTopics = await returnRawQuery(sql);
// });

// export const cronRestrict = cron.schedule("*/10 * * * * *", async () => {
//   try {
//     const posts = await returnRawQuery(postsSql);
//     logger.log("POSTS =>> \n", posts);
//     for (let element of posts) {
//       let type = element.post_type;
//       let postId = element.postId;
//       let userId = element.userId;
//       logger.log(`type: ${type}, postId: ${postId}, userId: ${userId}`);
//       let text = await returnContent(type, postId);
//       let result = await getContentSensitivity(text);
//       logger.log("result ==> ", result, "\n post ==>", type, postId, text);

//       const newArr = Object.values(result.moderation_classes).filter(
//         (item, i) => i != 0 && item >= 0.6
//       );

//       if (newArr.length > 0) {
//         await Post.update(
//           { restricted: true },
//           { where: { postId: postId, post_type: type } }
//         );
//         logger.log(11111111);
//         await RestrictedPost.create({
//           postId: postId,
//           userId: userId,
//           context:text,
//           post_type:type,
//           request_id: result.request.id,
//           sexual: result.moderation_classes.sexual,
//           discriminatory: result.moderation_classes.discriminatory,
//           insulting: result.moderation_classes.insulting,
//           violent: result.moderation_classes.violent,
//           toxic: result.moderation_classes.toxic,
//           self_harm: result.moderation_classes["self-harm"],
//         });
//       }
//     }
//   } catch (error) {
//     logger.log(error);
//   }
// });

// export const cronRecommendBooks = cron.schedule("*/15 * * * * *", async () => {
//   try {
//     const recommendBooks = async (categories) => {
//       const sql = `SELECT
//                       t.bookId,
//                       ROUND(
//                         AVG(rb.rating),
//                         1
//                       ) rate,
//                       CASE WHEN LENGTH(bc.title) > 15 THEN CONCAT(
//                         SUBSTRING(bc.title, 1, 15),
//                         '...'
//                       ) ELSE bc.title END truncatedTitle,
//                       bc.title,
//                       bc.thumbnail,
//                       MAX(t.categoryId) categoryId
//                     FROM
//                       (SELECT cba.bookId, cba.categoryId, c.category
//                     FROM
//                       category_book_association cba
//                     JOIN
//                       categories c
//                     ON
//                       cba.categoryId = c.id
//                     WHERE
//                       cba.categoryId IN (${categories.join()})
//                     LIMIT	5000) t
//                     JOIN
//                       book_collections bc
//                     ON
//                       t.bookId = bc.id
//                     LEFT JOIN
//                       rated_books rb
//                     ON
//                       rb.bookId = bc.id
//                     AND
//                       rb.rating IS NOT NULL
//                     GROUP BY
//                       t.bookId
//                     ORDER BY
//                       RAND()
//                     LIMIT 20`;
//       const result = await returnRawQuery(sql);
//       return result;
//     };
//     const getInitialData = async (userId) => {
//       const userBookDataSql = `	SELECT
//                                       ROUND(AVG(val), 1) val,
//                                       categoryId FROM (
//                                 SELECT COUNT(lb.id) val, cba.categoryId
//                                   FROM
//                                       liked_books lb
//                                   JOIN
//                                     category_book_association cba	ON cba.bookId = lb.bookId
//                                   JOIN
//                                     categories c ON c.id = cba.categoryId
//                                   WHERE
//                                     userId = ${userId}
//                                   AND
//                                     is_liked != 0
//                                   GROUP BY
//                                     cba.categoryId

//                                 UNION ALL

//                                 SELECT COUNT(id) val, categoryId
//                                   FROM
//                                     recommended_books
//                                   WHERE
//                                     userId = ${userId}
//                                   AND
//                                     isClicked = 1
//                                   AND
//                                     createdAt > DATE_SUB(CURDATE(), INTERVAL 2 WEEK)
//                                   GROUP BY
//                                     categoryId

//                                 UNION ALL

//                                 SELECT ROUND(AVG(rb.rating), 1) val, cba.categoryId
//                                   FROM
//                                     rated_books rb
//                                   JOIN
//                                     category_book_association cba	ON cba.bookId = rb.bookId
//                                   JOIN
//                                     categories c ON c.id = cba.categoryId
//                                   WHERE
//                                     userId = ${userId}
//                                   AND
//                                     rating IS NOT NULL
//                                   GROUP BY
//                                     cba.categoryId

//                                 UNION ALL

//                                 SELECT COUNT(brs.id) val, cba.categoryId
//                                   FROM
//                                       book_reading_states brs
//                                   JOIN
//                                     category_book_association cba	ON cba.bookId = brs.bookId
//                                   JOIN
//                                     categories c ON c.id = cba.categoryId
//                                   WHERE
//                                     userId = ${userId}
//                                   AND
//                                     reading_state != "Did not finish"
//                                   GROUP BY
//                                     cba.categoryId)temp
//                                 GROUP BY
//                                   temp.categoryId`;
//       const userReviewsDataSql = `SELECT r.review, cba.categoryId, c.category
//                         FROM
//                             reviews r
//                         JOIN
//                           category_book_association cba	ON cba.bookId = r.bookId
//                         JOIN
//                           categories c ON c.id = cba.categoryId
//                         WHERE
//                           userId = ${userId}`;
//       const reviewCountPerCategorySql = `SELECT
//                                         COUNT(r.id) review_count,
//                                         cba.categoryId,
//                                         c.category
//                                         FROM
//                                             reviews r
//                                         JOIN
//                                           category_book_association cba	ON cba.bookId = r.bookId
//                                         JOIN
//                                           categories c ON c.id = cba.categoryId
//                                         WHERE
//                                           userId = ${userId}
//                                         GROUP BY
//                                           cba.categoryId`;

//       return await Promise.all([
//         returnRawQuery(userBookDataSql),
//         returnRawQuery(userReviewsDataSql),
//         returnRawQuery(reviewCountPerCategorySql),
//       ]);
//     };
//     const usersWithReadBooksSql = `SELECT
//                                       COUNT(brs.id),
//                                       MAX(u.id) userId
//                                     FROM
//                                       book_reading_states brs
//                                     JOIN
//                                       users u
//                                     ON
//                                       u.id = brs.userId
//                                     WHERE
//                                       brs.reading_state = "Read"
//                                     GROUP BY
//                                       brs.userId
//                                     HAVING
//                                       COUNT(brs.id) <= 10`;
//     const usersWithReadBooks = await returnRawQuery(usersWithReadBooksSql);

//     if (usersWithReadBooks.length == 0) {
//       return;
//     }

//     for (const element of usersWithReadBooks) {
//       const userId = element.userId;
//       let summedVals = {};
//       let favoriteCategories = [];
//       let startIndex = 0;
//       let endIndex = 0;

//       const [userBookData, userReviewsData, reviewCount] = await getInitialData(
//         userId
//       );
//       if (userReviewsData.length != 0) {
//         const reviews = userReviewsData.map((i) => i.review);
//         const result = await reviewer(reviews);

//         for (const review of reviewCount) {
//           endIndex += review.review_count;
//           const reviewStarlabels = result.slice(startIndex, endIndex);
//           const totalVal = reviewStarlabels.reduce((acc, curr) => {
//             return parseInt(curr.label) + acc;
//           }, 0);
//           review["val"] = (totalVal / review.review_count).toFixed(1);
//           startIndex += review.review_count;
//         }
//       }
//       const mergedData = reviewCount
//         ? [...reviewCount, ...userBookData]
//         : userBookData;

//       mergedData.map((item) => {
//         if (summedVals[item.categoryId]) {
//           summedVals[item.categoryId] += Number(item.val);
//         } else {
//           summedVals[item.categoryId] = Number(item.val);
//         }
//       });

//       favoriteCategories = Object.entries(summedVals).sort(
//         (a, b) => b[1] - a[1]
//       );

//       if (favoriteCategories.length > 2) {
//         favoriteCategories = favoriteCategories.slice(0, 2);
//       }

//       favoriteCategories = favoriteCategories.map((i) => i[0]);
//       logger.log("favorite categories =>> \n", favoriteCategories);
//       logger.log("USER =>> \n", userId);
//       logger.log(usersWithReadBooks);

//       const recommendedBooks = await recommendBooks(favoriteCategories);
//       logger.log("RECOMMENDATIONS ==> \n", recommendedBooks.length);

//       // RecommendedBook.create({
//       //   userId:recommendedBooks.userId,
//       //   bookId:recommendedBooks.bookId,
//       //   categoryId:recommendedBooks.categoryId,
//       // })

//     }
//   } catch (error) {
//     logger.log(error);
//   }
// });

// cronGetTrendingTopics.start();
// cronRestrict.start();
// cronRecommendBooks.start();
