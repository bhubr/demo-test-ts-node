import { Schema, model, Document } from 'mongoose';

interface IUser {
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
}
export type IUserDocument = Document & IUser;
// 2. Create a Schema corresponding to the document interface.
const userSchema = new Schema<IUser>(
  {
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
  },
  { timestamps: true }
);

// eslint-disable-next-line @typescript-eslint/naming-convention
const User = model<IUser>('User', userSchema);
export default User;
