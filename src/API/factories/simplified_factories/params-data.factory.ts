import { returnBooleanValue } from '@_src/API/helpers/factories/data_generators/boolean_value_generator';
import { generateExtendableName } from '@_src/API/helpers/factories/data_generators/names_data_generator';
import {
  returnAuthKeyValue,
  returnAuthTokenValue,
  returnStringValue,
} from '@_src/API/helpers/factories/data_generators/values_generator';
import { ParamsDataModel } from '@_src/API/models/params-data.model';

export function prepareParamsDataSimplified(
  customKey: string,
  customToken: string,
  idValue?: string,
  customName?: string,
  status?: boolean,
  filtersValues?: string,
  fieldsValues?: string,
): ParamsDataModel {
  const key: string = returnAuthKeyValue(customKey);

  const token: string = returnAuthTokenValue(customToken);

  const idChecklist: string = returnStringValue(idValue);

  const name: string = generateExtendableName(customName);

  const state: boolean = returnBooleanValue(status);

  const filter: string = returnStringValue(filtersValues);

  const fields: string = returnStringValue(fieldsValues);

  const paramsData: ParamsDataModel = {
    key,
    token,
    ...(idChecklist && { idChecklist }),
    ...(customName !== undefined && { name }),
    ...(state && { state }),
    ...(filter !== '' && { filter }),
    ...(fields !== '' && { fields }),
  };

  return paramsData;
}
