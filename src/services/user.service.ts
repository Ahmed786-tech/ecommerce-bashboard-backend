import { User, IUser } from '../models/user.model';

export const createUser = async (body:IUser): Promise<IUser> => {
  const existingUser = await User.findOne({ email:body.email });
  if (existingUser) throw new Error('Email already in use');
  return await User.create(body);
};

export const loginUser = async (email: string, password: string): Promise<IUser> => {
    const user = await User.findOne({ email }) as IUser;
    if (!user || !(await user.comparePassword(password))) {
      throw new Error('Invalid credentials');
    }
    return user;
  };
