// src/testSetup.ts

import { DataSource } from "typeorm";
import { AppDataSource } from "./data-source";
import {
  PostgreSqlContainer,
  StartedPostgreSqlContainer,
} from "@testcontainers/postgresql";

let testDataSource: DataSource;
let startedPostgreSqlContainer: StartedPostgreSqlContainer;

beforeEach(async () => {
  const container = await new PostgreSqlContainer().start();

  startedPostgreSqlContainer = container;

  // Configure TypeORM to connect to the test database
  testDataSource = new DataSource({
    type: "postgres",
    host: container.getHost(),
    port: container.getPort(),
    username: container.getUsername(),
    password: container.getPassword(),
    database: container.getDatabase(),
    synchronize: true,
    logging: false,
    entities: ["./entities/**/*.ts"],
  });

  await testDataSource.initialize();
  AppDataSource.setOptions(testDataSource.options);
});

afterEach(async () => {
  if (testDataSource) {
    await testDataSource.destroy();
  }
  if (startedPostgreSqlContainer) {
    await startedPostgreSqlContainer.stop();
  }
});
