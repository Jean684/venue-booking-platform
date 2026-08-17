import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import express from "express";
import { resolvers } from "./graphql/resolvers";
import { typeDefs } from "./graphql/schema";
import "reflect-metadata";
import cors from "cors";


export async function setupApollo() {
  const app = express();

  app.use(
    cors({
      origin: "http://localhost:3000",
      credentials: true,
    })
  );
  
  app.use(express.json())
  const apolloServer = new ApolloServer({
    typeDefs,
    resolvers,
  });

  await apolloServer.start();
  // await apolloServer.start(app)

  app.use(
    "/graphql",
    expressMiddleware(apolloServer)
  );

  return app;
}
