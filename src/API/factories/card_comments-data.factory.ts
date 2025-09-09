import { CardCommentDataModel } from '@_src/API/models/card_comments-data.model';
import { faker } from '@faker-js/faker/locale/en_US';

export function prepareRandomCommentData(
  commentText: string,
  sentences?: number,
): CardCommentDataModel {
  // Solution 1
  // const text: string = commentText
  //   ? `${commentText} - ${faker.lorem.sentences({ min: 1, max: sentences ?? 1 })}`
  //   : `${faker.lorem.paragraphs({ min: 1, max: sentences ?? 1 })}`;
  // Solution II - shortened
  const text: string = commentText
    ? `${commentText} - ${faker.lorem.sentences(sentences ?? 1)}`
    : `${faker.lorem.paragraphs(sentences ?? 1)}`;

  const randomCommentData: CardCommentDataModel = {
    text,
  };
  return randomCommentData;
}
