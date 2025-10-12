import { CardDataModel } from '@_src/API/models/card-data.model';
import { faker } from '@faker-js/faker';

export function prepareRandomCardData(
  listId?: string,
  name?: string,
  desc?: string,
  sentencesLength?: number,
  position?: string | number,
  dueDate?: boolean,
  days?: number,
  // fake?: boolean,
): CardDataModel {
  const idList: string = listId ? listId : '';

  const cardName: string = name
    ? `${name} - ${faker.word.sample()}`
    : faker.word.sample();

  const cardDescription: string = desc
    ? `${desc} - ${faker.lorem.sentences(sentencesLength ?? 1)}`
    : faker.lorem.sentences(sentencesLength ?? 1);

  const pos: string | number | undefined = position ? position : '';

  // Date creationSolution I without faker

  const due: string = dueDate
    ? new Date(
        new Date().setDate(new Date().getDate() + (days ?? 0)),
      ).toISOString()
    : '';

  // Solution II with faker usage
  // const due: string =
  //   dueDate && fake
  //     ? faker.date.soon({ days: days, refDate: new Date() }).toISOString()
  //     : dueDate && !fake
  //       ? faker.date.recent({ days: days, refDate: new Date() }).toISOString()
  //       : '';

  // Full object generator - Solution I
  //   const randomCardDate: CardDataModel = {
  //     idList,
  //     name: cardName,
  //     desc: cardDescription,
  //     pos,
  //     due,
  //   };

  // Solution III updated types to array variable added
  // Preparation array of properties  for dynamically generated object
  //   const objectPropertiesArray: CardDataModel[] = [];

  // Values for feeling up objectPropertiesArray
  //   if (idList !== undefined && idList !== '')
  //     objectPropertiesArray.push({ idList: idList });
  //   if (name !== undefined) objectPropertiesArray.push({ name: cardName });
  //   if (desc !== undefined) objectPropertiesArray.push({ desc: cardDescription });
  //   if (pos !== undefined && pos !== '') objectPropertiesArray.push({ pos: pos });
  //   if (due) objectPropertiesArray.push({ due: due });

  // Needed for Solution III
  // Generate object with needed properties
  //   const randomCardData: CardDataModel = Object.assign(
  //     {},
  //     ...objectPropertiesArray,
  //   );

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
