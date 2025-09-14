import { ListDataModel } from '@_src/API/models/list-data.model';
import { faker } from '@faker-js/faker';

export function prepareRandomListData(
  boardId?: string,
  name?: string,
  pos?: string | number,
  closed?: boolean,
): ListDataModel {
  const idBoard: string | undefined = boardId;

  // Ternary operator usage instead of if else conditional statement

  const listName: string = name
    ? `${name} - ${faker.word.sample()}`
    : faker.word.sample();

  // Nullish operator usage "??"

  const listStatus: boolean = closed ?? false;

  // Full Data model preparation
  // Solution I full object return
  // const randomListData: ListDataModel = {
  //   idBoard,
  //   name: listName,
  //   pos,
  //   closed: listStatus,
  // };
  // Solution II & III
  const objectPropertiesArray: {
    [key: string]: string | number | boolean | undefined;
  }[] = [];

  // Adding to array only those properties which are needed
  if (boardId !== undefined) objectPropertiesArray.push({ idBoard: idBoard });
  if (name !== undefined) objectPropertiesArray.push({ name: listName });
  if (pos) objectPropertiesArray.push({ pos: pos });
  if (closed) objectPropertiesArray.push({ closed: listStatus });

  // Solution II object preparation for returning - reduce method + spread operators
  // const randomListData = objectPropertiesArray.reduce(
  //   (key, currentValue) => ({ ...key, ...currentValue }),
  //   {},
  // );

  // Solution II - auto object generation using Object.assign() method
  const randomListData: ListDataModel = Object.assign(
    {},
    ...objectPropertiesArray,
  );

  return randomListData;
}

// export interface ListDataModel {
//   idBoard?: string;
//   name?: string;
//   pos?: string | number;
//   closed?: boolean;
// }
