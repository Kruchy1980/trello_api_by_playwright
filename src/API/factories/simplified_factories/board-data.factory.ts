import { generateRandomBoardName } from '@_src/API/helpers/factories/data_generators/names_data_generator';
import { BoardDataModel } from '@_src/API/models/board-data.model';
import { generateRandomBoardDescription } from 'future/7.Refactor_simplifying_factories/helpers/factories/data_generators/descriptions_generators_helpers';

export function prepareRandomBoardDataSimplified(
  boardName?: string,
  fake?: boolean,
  numberCharacters?: number,
  description?: string,
  fakeDesc?: boolean,
  numberParagraphs?: number,
): BoardDataModel {
  // let boardName: string = '';
  // let boardDescription: string = '';
  // let randomBoardData: BoardDataModel = {};

  const name: string = generateRandomBoardName(
    boardName,
    fake,
    numberCharacters,
  );

  // If conditional statement usage
  // if (name && fake) {
  //   boardName = `${name} - ${faker.word.sample(numberCharacters)}`;
  // } else if (name && !fake) {
  //   boardName = `${name}`;
  // } else if (!name) {
  //   boardName = `${faker.word.sample(numberCharacters)}`;

  // }
  const desc: string = generateRandomBoardDescription(
    description,
    fakeDesc,
    numberParagraphs,
  );

  // if (description && fakeDesc) {
  //   boardDescription = `${description} - ${faker.lorem.paragraphs(numberParagraphs)}`;
  // } else if (description && !fakeDesc) {
  //   boardDescription = `${description}`;
  // } else if (!description) {
  //   boardDescription = `${faker.lorem.paragraphs(numberParagraphs)}`;
  // }

  // if (name !== '' && description !== '')
  //   randomBoardData = {
  //     name: boardName,
  //     desc: boardDescription,
  //   };
  // if (name === '')
  //   randomBoardData = {
  //     desc: boardDescription,
  //   };
  // if (description === '')
  //   randomBoardData = {
  //     name: boardName,
  //   };
  const randomBoardData: BoardDataModel = {
    ...(name !== '' && { name }),
    ...(desc !== '' && { desc }),
  };

  return randomBoardData;
}

// export interface BoardDataModel {
//   name?: string;
//   desc?: string;
// }
