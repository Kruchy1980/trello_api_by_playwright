import { BoardDataModel } from '@_src/API/models/board-data.model';

export function prepareRandomBoardData(
  name?: string,
  description?: string,
): BoardDataModel {
  let boardName;
  let boardDescription;

  // If conditional statement usage
  if (name) {
    boardName = name;
  } else if (!name) {
    boardName = '';
  }

  if (description) {
    boardDescription = description;
  } else if (!description) {
    boardDescription = '';
  }

  const randomBoardData: BoardDataModel = {
    name: boardName,
    desc: boardDescription,
  };

  return randomBoardData;
}

// export interface BoardDataModel {
//   name?: string;
//   desc?: string;
// }
