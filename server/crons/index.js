import cron from "node-cron";
import { logger, returnRawQuery } from "../utils/constants.js";

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

// export const job = cron.schedule("* */1 * * *", async () => {
//   trendingTopics = await returnRawQuery(sql);
// });

// job.start();
