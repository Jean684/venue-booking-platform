import "reflect-metadata";
import { DataSource, DataSourceOptions } from "typeorm";
import { User } from "./entity/User";
import { Venue } from "./entity/Venue";
import { Application } from "./entity/Application";


const isTesting = process.env.NODE_ENV === "test";

const sqliteConfig: DataSourceOptions = {
  type: "sqlite",
  database: isTesting ? ":memory:" : "database.sqlite",
  entities: [User, Venue],
  synchronize: true,
  logging: false,
};

const mssqlConfig: DataSourceOptions = {
  type: "mssql",
  host: "dipto-database.cn2ems8y2mfe.ap-southeast-2.rds.amazonaws.com",
  username: "s4091144",
  password: "fu8ofljkgsDJgs",
  database: "s4091144",
      options: {
        encrypt: false, // Use this for Azure SQL Database
        //trustedConnection: false // Use this for Windows Authentication (if applicable)
    },
  // synchronize: true will automatically create database tables based on entity definitions
  // and update them when entity definitions change. This is useful during development
  // but should be disabled in production to prevent accidental data loss.
  synchronize: true, 
  logging: true, // Enable logging for debugging purposes
  entities: [User, Venue], // Register the Tutorial entity with TypeORM, allowing it to manage the corresponding database table and perform CRUD operations based on the defined schema.
  migrations: [],
  subscribers: [],
};

export const AppDataSource = new DataSource(
  isTesting ? sqliteConfig : mssqlConfig
);

