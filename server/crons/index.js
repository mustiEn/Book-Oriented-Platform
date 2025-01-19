import cron from "node-cron";
import { logger, returnRawQuery } from "../utils/constants.js";

const sql = `SELECT
                p.topicId,t.topic,COUNT(p.id) post_count
            FROM
                posts p
            INNER JOIN topics t ON t.id = p.topicId
            WHERE
                p.createdAt >= NOW() - INTERVAL 24 HOUR
            AND p.post_type != 'comment'
            AND p.topicId IS NOT NULL
            GROUP BY p.topicId;
                `;
export let trendingTopics = await returnRawQuery(sql);

// export const job = cron.schedule("* */1 * * *", async () => {
//   trendingTopics = await returnRawQuery(sql);
// });

// job.start();
