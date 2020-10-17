import { Schema, Document, model, models, Model } from 'mongoose';

interface LoginDocument extends Document {
  session: string;
  tokenSecret: string;
}

const loginSchema = new Schema({
  session: String,
  tokenSecret: String,
});

export const LoginSession: Model<LoginDocument> =
  models.LoginSession || model<LoginDocument>('LoginSession', loginSchema);
