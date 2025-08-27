import { BoardDataModel } from '@_src/API/models/board-data.model';
import { faker } from '@faker-js/faker';

export function prepareRandomBoardData(
  name?: string,
  fake?: boolean,
  numberCharacters?: number,
  description?: string,
  fakeDesc?: boolean,
  numberParagraphs?: number,
): BoardDataModel {
  let boardName: string = '';
  let boardDescription: string = '';
  let randomBoardData: BoardDataModel = {};

  // If conditional statement usage
  if (name && fake) {
    boardName = `${name} - ${faker.word.sample(numberCharacters)}`;
  } else if (name && !fake) {
    boardName = `${name}`;
  } else if (!name) {
    boardName = `${faker.word.sample(numberCharacters)}`;
  }

  if (description && fakeDesc) {
    boardDescription = `${description} - ${faker.lorem.paragraphs(numberParagraphs)}`;
  } else if (description && !fakeDesc) {
    boardDescription = `${description}`;
  } else if (!description) {
    boardDescription = `${faker.lorem.paragraphs(numberParagraphs)}`;
  }

  if (name !== '' && description !== '')
    randomBoardData = {
      name: boardName,
      desc: boardDescription,
    };
  if (name === '')
    randomBoardData = {
      desc: boardDescription,
    };
  if (description === '')
    randomBoardData = {
      name: boardName,
    };

  return randomBoardData;
}

// export interface BoardDataModel {
//   name?: string;
//   desc?: string;
// }
