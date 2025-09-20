import { returnBooleanValue } from '@_src/API/helpers/factories/data_generators/boolean_value_generator';
import { generateRandomSimpleName } from '@_src/API/helpers/factories/data_generators/names_data_generator';
import { ListDataModel } from '@_src/API/models/list-data.model';

export function prepareRandomListDataSimplified(
  boardId?: string,
  listName?: string,
  pos?: string | number,
  listStatus?: boolean,
): ListDataModel {
  const idBoard: string | undefined = boardId;

  const name: string = generateRandomSimpleName(listName);

  const closed: boolean = returnBooleanValue(listStatus);

  const randomListData: ListDataModel = {
    ...(boardId !== undefined && { idBoard }),
    ...(listName !== undefined && { name }),
    ...(pos && { pos }),
    ...(closed && { closed }),
  };

  return randomListData;
}
