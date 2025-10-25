import { ChecklistDataModel } from '@_src/API/models/checklist-data.model';
import { faker } from '@faker-js/faker';

export function prepareRandomChecklistData(
  cardId?: string,
  checklistName?: string,
  titleLength?: number,
  position?: string | number,
  dynamicValue?: string,
  sentencesLength?: number,
): ChecklistDataModel {
  const idCard: string = cardId ? cardId : '';
  const name: string =
    checklistName && checklistName !== ''
      ? `${checklistName} - ${faker.lorem.words(titleLength ?? 1)}`
      : checklistName
        ? faker.lorem.words(titleLength ?? 1)
        : '';

  const pos: string | number = position ? position : '';

  const value: string =
    dynamicValue && dynamicValue !== ''
      ? `${dynamicValue} - ${faker.lorem.sentences(sentencesLength ?? 1)}`
      : dynamicValue
        ? faker.lorem.sentences(sentencesLength ?? 1)
        : '';

  // Solution I Full object returning
  //   const newChecklistData: ChecklistDataModel = {
  //     idCard,
  //     name,
  //     pos,
  //   };

  // Solution II Full object returning
  const newChecklistData: ChecklistDataModel = {
    ...(idCard !== '' && { idCard }),
    ...(name !== '' && { name }),
    ...(pos !== '' && { pos }),
    ...(value !== '' && { value }),
  };

  return newChecklistData;
}
