import { generateRandomSimpleDescription } from '@_src/API/helpers/factories/data_generators/descriptions_data_generator';
import { CardCommentDataModel } from '@_src/API/models/card_comments-data.model';

export function prepareRandomCommentDataSimplified(
  commentText: string,
  sentences?: number,
): CardCommentDataModel {
  const text: string = generateRandomSimpleDescription(commentText, sentences);

  const randomCommentData: CardCommentDataModel = {
    text,
  };
  return randomCommentData;
}
