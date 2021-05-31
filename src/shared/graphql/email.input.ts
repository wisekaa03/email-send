import { Field, InputType } from '@nestjs/graphql';

@InputType('Task', {
  description: 'Task to email to destination',
})
export class EmailInput {
  @Field(() => String, { description: 'Получатель', nullable: false })
  destination!: string;

  @Field(() => String, { description: 'Тема', nullable: false })
  subject!: string;

  @Field(() => String, { description: 'Текст', nullable: false })
  body!: string;
}
