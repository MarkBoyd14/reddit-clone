import { Query, Resolver, Ctx, Arg, Int, Mutation } from "type-graphql";
import { Post } from '../entities/Post'
import { MyContext } from "src/types";
import { idText } from "typescript";

@Resolver()
export class PostResolver {
  // Query all posts
  @Query(() => [Post])
  posts(
    @Ctx() { em }: MyContext
  ): Promise<Post[]> {
    return em.find(Post, {});
  }

  // Query one post
  @Query(() => Post, {nullable: true})
  post(
    @Arg('id') id: number,
    @Ctx() { em }: MyContext
  ): Promise<Post | null> {
    return em.findOne(Post, { id });
  }

  // Create post
  @Mutation(() => Post)
  async createPost(
    @Arg('title') title: string,
    @Ctx() { em }: MyContext
  ): Promise<Post | null> {
    const post = em.create(Post, {title});
    await em.persistAndFlush(post);
    return post;
  }

    // Edit post
  @Mutation(() => Post, {nullable: true})
  async updatePost(
    @Arg('id') id: number,
    // Must set type if nullable
    @Arg('title', () => String, {nullable: true}) title: string,
    @Ctx() { em }: MyContext
  ): Promise<Post | null> {
    const post = await em.findOne(Post, {id});  
    if (!post) {
      return null;
    }    
    if (typeof title !== 'undefined') {
      post.title = title;
      await em.persistAndFlush(post);
    }       
    return post;    
  }

  @Mutation(() => Boolean)
  async deletePost(
    @Arg('id') id: number,    
    @Ctx() { em }: MyContext
  ): Promise<boolean> {  
    await em.nativeDelete(Post, {id})  
    return true;    
  }
}

