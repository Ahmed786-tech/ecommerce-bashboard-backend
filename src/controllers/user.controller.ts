import { NextFunction, Request, Response } from 'express';
import * as userService from '../services/user.service';
import { signToken } from '../utils/jwt';

export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const body = req.body;
    const user = await userService.createUser(body);
    const token = signToken(user._id.toString());
    res.status(201).json({ token });
  } catch (err) {
    next(err);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;
    const user = await userService.loginUser(email, password);
    const token = signToken(user._id.toString());
    res.json({ token });
  } catch (err) {
    next(err);
  }
};

export const getProfile = async (req: Request, res: Response) => {
  res.json({ user: req?.user });
};
