import { generateRandomLargeDescription } from '@_src/API/helpers/factories/data_generators/descriptions_data_generator';
import { generateRandomLargeName } from '@_src/API/helpers/factories/data_generators/names_data_generator';
import { BoardDataModel } from '@_src/API/models/board-data.model';

export function prepareRandomBoardDataSimplified(
  boardName?: string,
  fake?: boolean,
  numberCharacters?: number,
  description?: string,
  fakeDesc?: boolean,
  numberParagraphs?: number,
): BoardDataModel {
  const name: string = generateRandomLargeName(
    boardName,
    fake,
    numberCharacters,
  );

  // }
  const desc: string = generateRandomLargeDescription(
    description,
    fakeDesc,
    numberParagraphs,
  );

  const randomBoardData: BoardDataModel = {
    ...(name !== '' && { name }),
    ...(desc !== '' && { desc }),
  };

  return randomBoardData;
}
