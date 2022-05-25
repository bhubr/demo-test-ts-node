import { Schema, Types, model, Document } from 'mongoose';

interface IPost {
  author: Types.ObjectId;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}
export type IPostDocument = Document & IPost;
// 2. Create a Schema corresponding to the document interface.
const postSchema = new Schema<IPost>(
  {
    author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    content: { type: String, required: true },
  },
  { timestamps: true }
);

// eslint-disable-next-line @typescript-eslint/naming-convention
const Post = model<IPost>('Post', postSchema);
export default Post;
