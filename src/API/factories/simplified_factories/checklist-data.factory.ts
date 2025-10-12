import { generateExtendableDescription } from '@_src/API/helpers/factories/data_generators/descriptions_data_generator';
import { generateExtendableName } from '@_src/API/helpers/factories/data_generators/names_data_generator';
import {
  returnProperValue,
  returnStringValue,
} from '@_src/API/helpers/factories/data_generators/values_generator';
import { ChecklistDataModel } from '@_src/API/models/checklist-data.model';

export function prepareRandomChecklistDataSimplified(
  cardId?: string,
  checklistName?: string,
  titleLength?: number,
  position?: string | number,
  dynamicValue?: string,
  sentencesLength?: number,
): ChecklistDataModel {
  const idCard: string = returnStringValue(cardId);

  const name: string = generateExtendableName(checklistName, titleLength);

  const pos: string | number = returnProperValue(position);

  const value: string = generateExtendableDescription(
    dynamicValue,
    sentencesLength,
  );

  const newChecklistData: ChecklistDataModel = {
    ...(idCard !== '' && { idCard }),
    ...(checklistName !== undefined && { name }),
    ...(pos !== '' && { pos }),
    ...(dynamicValue !== undefined && { value }),
  };

  return newChecklistData;
}
