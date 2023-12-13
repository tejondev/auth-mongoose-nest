import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class User extends Document {
  @Prop({ required: true })
  fullname: string;

  @Prop({ required: true, unique: true, index: true })
  email: string;

  @Prop({ required: true, select: false })
  password: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
