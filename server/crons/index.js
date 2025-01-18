import cron from "node-cron";
import { logger, returnRawQuery } from "../utils/constants.js";

const sql = `SELECT 
                p.topicId,COUNT(p.id) 
            FROM 
                posts p 
            WHERE 
                p.createdAt >= NOW() - INTERVAL 24 HOUR    
            AND p.post_type != 'comment'
            AND p.topicId IS NOT NULL    
            GROUP BY p.topicId; 
                `;
export let trendingTopics = await returnRawQuery(sql);

export const job = cron.schedule("* */1 * * *", async () => {
  trendingTopics = await returnRawQuery(sql);
});

job.start();
