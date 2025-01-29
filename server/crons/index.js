import cron from "node-cron";
import { logger, returnRawQuery } from "../utils/constants.js";
import dotenv from "dotenv";
import { Post } from "../models/Post.js";

dotenv.config();

const postsSql = `SELECT 
                    id, post_type, postId 
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

// export const cronRestrict = cron.schedule("*/5 * * * * *", async () => {
//   const posts = await returnRawQuery(postsSql);
//   logger.log("POSTS =>> \n", posts);
//   for await (const element of posts) {
//     const type = element.post_type;
//     const postId = element.postId;
//     const text = await returnContent(type, postId);
//     const result = await getContentSensitivity(text);
//     logger.log("result ==> ", result, "\n post ==>", type, postId, text);
// await Post.update(
//   {postId:postId,
//     post_type: type,
//   },
//   {restricted:true}
// )

//   }
// });

// cronGetTrendingTopics.start();
// cronRestrict.start();
