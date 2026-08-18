import "dotenv/config";
import "reflect-metadata";
import { DataSource } from "typeorm";
import { User } from "./entity/User";
import { Venue } from "./entity/Venue";
import { Application } from "./entity/Application";
import { Blockdate } from "./entity/Blockdate";
import { DataSourceOptions } from "typeorm/browser";

const isTestEnvironment = process.env.NODE_ENV === "test";

export const AppDataSource = isTestEnvironment
  ? new DataSource({
      type: "sqlite",
      database: ":memory:",
      dropSchema: true,
      synchronize: true,
      logging: false,
      entities: [User, Venue, Application, Blockdate],
    })
  : new DataSource({
      type: "mssql",
      host: process.env.DB_HOST,
      //port: Number(process.env.DB_PORT || 1433),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      options: {
        encrypt: false,
      },
      synchronize: true,
      logging: true,
      entities: [User, Venue, Application, Blockdate],
      migrations: [],
      subscribers: [],
    });





