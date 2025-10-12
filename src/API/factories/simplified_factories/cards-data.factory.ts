import { generateRandomStringDate } from '@_src/API/helpers/factories/data_generators/date_generator';
import { generateRandomSimpleDescription } from '@_src/API/helpers/factories/data_generators/descriptions_data_generator';
import { generateRandomSimpleName } from '@_src/API/helpers/factories/data_generators/names_data_generator';
import {
  returnProperValue,
  returnStringValue,
} from '@_src/API/helpers/factories/data_generators/values_generator';

import { CardDataModel } from '@_src/API/models/card-data.model';

export function prepareRandomCardDataSimplified(
  listId?: string,
  cardName?: string,
  cardDescription?: string,
  sentencesLength?: number,
  position?: string | number,
  dueDate?: boolean,
  days?: number,
): CardDataModel {
  const idList: string = returnStringValue(listId);

  const name: string = generateRandomSimpleName(cardName);

  const desc: string = generateRandomSimpleDescription(
    cardDescription,
    sentencesLength,
  );

  const pos: string | number = returnProperValue(position);

  const due: string = generateRandomStringDate(dueDate, days);

  const randomCardData: CardDataModel = {
    ...(idList !== undefined && idList !== '' && { idList }),
    ...(cardName !== undefined && { name }),
    ...(cardDescription !== undefined && { desc }),
    ...(pos !== undefined && pos !== '' && { pos }),
    ...(due && { due }),
  };

  return randomCardData;
}
