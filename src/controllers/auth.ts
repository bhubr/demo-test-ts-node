/* eslint-disable import/prefer-default-export */
import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import emailValidator from 'email-validator';

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
  if (!emailValidator.validate(email)) {
    return res.status(400).send({
      error: '"email" is invalid',
    });
  }
  if (!password) {
    return res.status(400).send({
      error: '"password" is required',
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
