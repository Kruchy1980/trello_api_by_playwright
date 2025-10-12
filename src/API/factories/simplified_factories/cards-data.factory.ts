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
  // const idList: string = listId ? listId : '';
  const idList: string = returnStringValue(listId);

  // const cardName: string = name
  //   ? `${name} - ${faker.word.sample()}`
  //   : faker.word.sample();
  const name: string = generateRandomSimpleName(cardName);

  // const cardDescription: string = desc
  //   ? `${desc} - ${faker.lorem.sentences(sentencesLength ?? 1)}`
  //   : faker.lorem.sentences(sentencesLength ?? 1);
  const desc: string = generateRandomSimpleDescription(
    cardDescription,
    sentencesLength,
  );

  // const pos: string | number | undefined = position ? position : '';
  const pos: string | number = returnProperValue(position);

  // const due: string = dueDate
  //   ? new Date(
  //       new Date().setDate(new Date().getDate() + (days ?? 0)),
  //     ).toISOString()
  //   : '';
  const due: string = generateRandomStringDate(dueDate, days);

  // Solution IV Spread operators and create returned object
  const randomCardData: CardDataModel = {
    ...(idList !== undefined && idList !== '' && { idList }),
    ...(name !== undefined && { name: cardName }),
    ...(desc !== undefined && { desc: cardDescription }),
    ...(pos !== undefined && pos !== '' && { pos }),
    ...(due && { due }),
  };

  return randomCardData;
}

/*
    const data: CardDataModel = {
      idList: createdListsIds[0],
      name: 'My first card name',
      desc: 'My first card Description',
      due: new Date().toISOString(),
    };

            const data: CardDataModel = {
              name: 'My first card name - update',
              due: new Date(
                new Date().setDate(new Date().getDate() + 2),
              ).toISOString(),
            };

*/
