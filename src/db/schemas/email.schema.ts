import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

import { EMAIL_STATE } from '@shared/graphql';

export type EmailDocument = Email & Document;

@ObjectType('Email', {
  description: 'Email',
})
@Schema()
export class Email {
  @Field(() => ID, { description: 'ИД', nullable: false })
  id?: any;

  @Field(() => Date, { description: 'Время создания', nullable: false })
  @Prop({ type: Date, default: Date.now })
  createdAt?: Date;

  @Field(() => Date, { description: 'Время изменения', nullable: false })
  @Prop({ type: Date, default: Date.now })
  updatedAt?: Date;

  @Field(() => EMAIL_STATE, { description: 'Статус отправки', nullable: false })
  @Prop({
    type: String,
    enum: [
      EMAIL_STATE.NOT_EXIST,
      EMAIL_STATE.OK,
      EMAIL_STATE.PROCEED,
      EMAIL_STATE.REJECT,
    ],
  })
  state!: EMAIL_STATE;

  @Field(() => String, { description: 'Получатель', nullable: false })
  @Prop({ type: String, required: true })
  destination!: string;

  @Field(() => String, { description: 'Тема', nullable: false })
  @Prop({ type: String, required: true })
  subject!: string;
}

export class EmailBody extends Email {
  @Field(() => String, { description: 'Текст', nullable: false })
  body!: string;
}

export const EmailSchema = SchemaFactory.createForClass(Email);
