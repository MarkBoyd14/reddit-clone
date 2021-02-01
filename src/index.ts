import 'reflect-metadata';
import { MikroORM } from "@mikro-orm/core";
import {__prod__} from './constants'
import { Post } from "./entities/Post";
import mikroConfig from './mikro-orm.config';
import express from 'express';
import {ApolloServer} from 'apollo-server-express';
import {buildSchema} from 'type-graphql';
import {HelloResolver} from './resolvers/hello';
import {PostResolver} from './resolvers/post'

const main = async () => {  
  const orm = await MikroORM.init(mikroConfig);  
  await orm.getMigrator().up();

  // Set up graphql server
  const app = express();
  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [HelloResolver, PostResolver],
      validate: false,
    }),
    context: () => ({ em: orm.em })
  });

  apolloServer.applyMiddleware({app});
  
  app.listen(4000, () => {
    console.log('Server started on localhost:4000')
  });
  // Create and view test post
  // const post = orm.em.create(Post, {title: 'My first post!'});
  // await orm.em.persistAndFlush(post);
  // const posts = await orm.em.find(Post, {});
  // console.log(posts);
}

main();