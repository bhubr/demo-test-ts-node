/* eslint-disable import/prefer-default-export */
import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';

import User from '../models/User';
import { jwtSecret, isProd } from '../settings';

/**
 * Handle user signup
 */
export async function postSignup(req: Request, res: Response) {
  const { email, password } = req.body;
  if (!email) {
    return res.status(400).send({
      error: '"email" is required',
    });
  }

  // Prevent duplicate email insertion
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(409).send({
      error: 'a user already exists with this email',
    });
  }

  const user = await User.create({
    email,
    password,
  });

  const { _id } = user.toObject();

  const token = jwt.sign({ _id }, jwtSecret);
  res.cookie('jwt', token, {
    httpOnly: true,
    secure: isProd,
  });

  return res.status(201).send({
    userId: user._id,
    jwt: token,
  });
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
