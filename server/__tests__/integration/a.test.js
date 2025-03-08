import { afterEach, beforeEach, expect, test } from "vitest";
import { MySqlContainer } from "@testcontainers/mysql";
import { createConnection } from "mysql2/promise";

let container;
let client;

beforeEach(async () => {
  console.log("Starting MySQL container...");
  container = await new MySqlContainer().start();
  console.log("MySQL container started");

  console.log("Container details:", {
    host: container.getHost(),
    port: container.getPort(),
    database: container.getDatabase(),
    user: container.getUsername(),
    password: container.getUserPassword(),
  });

  console.log("Creating database connection...");
  client = await createConnection({
    host: container.getHost(),
    port: container.getPort(),
    database: container.getDatabase(),
    user: container.getUsername(),
    password: container.getUserPassword(),
  });
  console.log("Database connection established");
}, 60000); // Increase timeout if needed

afterEach(async () => {
  if (client) {
    await client.end();
    console.log("Database connection closed");
  }
  if (container) {
    await container.stop();
    console.log("MySQL container stopped");
  }
}, 60000); // Increase timeout for cleanup

test("111", () => {
  const a = 1 + 1;
  expect(a).toBe(2);
});
