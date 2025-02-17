import cron from "node-cron";
import { logger, returnRawQuery } from "../utils/constants.js";
import dotenv from "dotenv";
import { Post } from "../models/Post.js";
import { RestrictedPost } from "../models/RestrictedPost.js";
import { reviewer } from "../server.js";

dotenv.config();

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
const userBookDataSql = `	SELECT SUM(val) val, categoryId, MAX(category) category FROM (
                            SELECT COUNT(lb.id) val, cba.categoryId, c.category
                            FROM
                                liked_books lb
                            JOIN 
                              category_book_association cba	ON cba.bookId = lb.bookId 
                            JOIN 
                              categories c ON c.id = cba.categoryId
                            WHERE 
                              userId = 6
                            AND 
                              is_liked != 0
                            GROUP BY 
                              cba.categoryId
                              
                            UNION ALL
                            
                            SELECT ROUND(AVG(rb.rating), 1) val, cba.categoryId, c.category
                            FROM
                              rated_books rb
                            JOIN 
                              category_book_association cba	ON cba.bookId = rb.bookId 
                            JOIN 
                              categories c ON c.id = cba.categoryId
                            WHERE 
                              userId = 6
                            AND 
                              rating IS NOT NULL
                            GROUP BY 
                              cba.categoryId
                              
                            UNION ALL
                            
                            SELECT COUNT(brs.id) val, cba.categoryId, c.category
                            FROM
                                book_reading_states brs
                            JOIN 
                              category_book_association cba	ON cba.bookId = brs.bookId 
                            JOIN 
                              categories c ON c.id = cba.categoryId
                            WHERE 
                              userId = 6
                            AND 
                              reading_state != "Did not finish"
                            GROUP BY 
                              cba.categoryId)temp
                            GROUP BY 
                              temp.categoryId`;
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
const userReviewsSql = `SELECT r.review, cba.categoryId, c.category
                        FROM
                            reviews r
                        JOIN 
                          category_book_association cba	ON cba.bookId = r.bookId 
                        JOIN 
                          categories c ON c.id = cba.categoryId
                        WHERE 
                          userId = 6`;

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

// export const cronRecommendBooks = cron.schedule("*/10 * * * * *", async () => {
//   try {
//     const reviewCountDict = {}
//     const reviewCountPerCategory = await returnRawQuery(reviewCountPerCategorySql)

//       const result = await reviewer("i love it");
//   } catch (error) {
//     logger.log(error)
//   }
// })

// cronGetTrendingTopics.start();
// cronRestrict.start();
