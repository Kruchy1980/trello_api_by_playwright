import { returnBooleanValue } from '@_src/API/helpers/factories/data_generators/boolean_value_generator';
import { generateRandomListName } from '@_src/API/helpers/factories/data_generators/names_data_generator';
import { ListDataModel } from '@_src/API/models/list-data.model';

export function prepareRandomListDataSimplified(
  boardId?: string,
  listName?: string,
  pos?: string | number,
  listStatus?: boolean,
): ListDataModel {
  const idBoard: string | undefined = boardId;

  // Ternary operator usage instead of if else conditional statement

  // const listName: string = name
  //   ? `${name} - ${faker.word.sample()}`
  //   : faker.word.sample();

  const name: string = generateRandomListName(listName);

  // Nullish operator usage "??"

  // const listStatus: boolean = closed ?? false;
  const closed: boolean = returnBooleanValue(listStatus);

  // Solution II & III
  // const objectPropertiesArray: {
  //   [key: string]: string | number | boolean | undefined;
  // }[] = [];

  // // Adding to array only those properties which are needed
  // if (boardId !== undefined) objectPropertiesArray.push({ idBoard: idBoard });
  // if (name !== undefined) objectPropertiesArray.push({ name: listName });
  // if (pos) objectPropertiesArray.push({ pos: pos });
  // if (closed) objectPropertiesArray.push({ closed: listStatus });

  // // Solution II - auto object generation using Object.assign() method
  // const randomListData: ListDataModel = Object.assign(
  //   {},
  //   ...objectPropertiesArray,
  // );
  const randomListData: ListDataModel = {
    ...(boardId !== undefined && { idBoard }),
    ...(listName !== undefined && { name }),
    ...(pos && { pos }),
    ...(closed && { closed }),
  };

  return randomListData;
}

// export interface ListDataModel {
//   idBoard?: string;
//   name?: string;
//   pos?: string | number;
//   closed?: boolean;
// }
