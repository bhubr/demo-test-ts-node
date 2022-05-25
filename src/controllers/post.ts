/* eslint-disable import/prefer-default-export */
import { Request, Response } from 'express';

import User from '../models/User';
import Post from '../models/Post';

type ReqWithAuth = Request & { auth: { _id: string } };

/**
 * Handle create post
 */
export async function createPost(req: Request, res: Response) {
  const user = (req as ReqWithAuth).auth;
  const { title, content } = req.body;
  // Pas une façon élégante de faire (préférer joi ou express-validator)
  if (!title) {
    return res.status(400).send({
      error: '"title" is required',
    });
  }
  if (!content) {
    return res.status(400).send({
      error: '"content" is required',
    });
  }

  const post = await Post.create({
    author: user._id,
    title,
    content,
  });

  return res.status(201).send(post.toObject());
}
/**
 * Handle create post
 */
export async function updatePost(req: Request, res: Response) {
  const user = (req as ReqWithAuth).auth;
  const { postId } = req.params;
  const { title, content } = req.body;
  // Pas une façon élégante de faire (préférer joi ou express-validator)
  if (!title) {
    return res.status(400).send({
      error: '"title" is required',
    });
  }
  if (!content) {
    return res.status(400).send({
      error: '"content" is required',
    });
  }

  const post = await Post.findById(postId);
  if (!post) {
    return res.status(404).send({
      error: 'post not found',
    });
  }

  if (!post.author.equals(user._id)) {
    return res.status(403).send({
      error: 'you have no right to do this',
    });
  }

  const updatedPost = await Post.findByIdAndUpdate(
    postId,
    {
      title,
      content,
    },
    { returnDocument: 'after' }
  );

  return res.status(200).send(updatedPost!.toObject());
}

/**
 * Handle user signin
 */
// async function postSignin(req: Request, res: Response) {
//   const { email, password } = req.body;

//   // Prevent duplicate email insertion
//   const user = await User.findOne({ email });
//   if (!user) {
//     return res.status(401).send({
//       error: 'invalid credentials email',
//     });
//   }

//   const passwordMatches = await user.comparePassword(password);
//   if (!passwordMatches) {
//     return res.status(401).send({
//       error: 'invalid credentials pwd',
//     });
//   }

//   const jwt = await generateJwtForUser(user);
//   res.cookie('jwt', jwt, jwtCookieOptions);

//   return res.status(200).send({
//     userId: user._id,
//     jwt,
//   });
// }

/**
 * Validated controllers
 */
// export const validatedPostSignup = [validatePostSignup, postSignup];
// export const validatedPostSignin = [validatePostSignin, postSignin];
