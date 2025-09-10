import { ParamsDataModel } from '@_src/API/models/params-data.model';
import { params } from '@_src/API/utils/api_utils';
import { faker } from '@faker-js/faker';

export function prepareParamsData(
  customKey: string,
  customToken: string,
  idValue?: string,
  customName?: string,
  status?: boolean,
  filtersValues?: string,
  fieldsValues?: string,
): ParamsDataModel {
  const key: string = customKey ? customKey : params.key;

  const token: string = customToken ? customToken : params.token;

  const idChecklist: string = idValue ? idValue : '';

  const name: string =
    customName !== ''
      ? `${customName} - ${faker.lorem.words()}`
      : customName === ''
        ? faker.lorem.words()
        : '';

  const state: boolean = status ? status : false;

  const filter: string = filtersValues ? filtersValues : '';

  const fields: string = fieldsValues ? fieldsValues : '';

  const paramsData: ParamsDataModel = {
    key,
    token,
    ...(idChecklist && { idChecklist }),
    ...(name === undefined && { name }),
    ...(state && { state }),
    ...(filter !== '' && { filter }),
    ...(fields !== '' && { fields }),
  };

  return paramsData;
}
