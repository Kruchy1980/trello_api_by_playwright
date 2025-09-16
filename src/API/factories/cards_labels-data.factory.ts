import {
  CardLabelDataModel,
  LabelDataModel,
  LabelOperationsDataModel,
} from '@_src/API/models/card_labels-data.model';
import { faker } from '@faker-js/faker';

// // For Labels Created For Board
// export interface LabelDataModel {
//   color: string;
//   name: string;
//   idBoard: string;
// }

export function prepareRandomBoardLabelData(
  idBoard: string,
  customColor?: string,
  labelName?: string,
  words?: number,
): LabelDataModel {
  // Solution II with choice of random color method
  // Prepare method which generates random color from array of colors
  const randomColorGenerator = (): string => {
    // INFO: Just Because Trello do not accept any random colors than example list is prepared without using faker
    const colors = [
      'green',
      'yellow',
      'red',
      'orange',
      'purple',
      'blue',
      'sky',
      'lime',
      'pink',
      'black',
    ];
    const randomColorIndex = Math.floor(Math.random() * colors.length);
    return colors[randomColorIndex];
  };
  const color: string = !customColor ? randomColorGenerator() : customColor;

  const name: string = labelName
    ? `${labelName} - ${faker.lorem.words(words ?? 1)} - ${color}`
    : `${faker.lorem.words(words ?? 1)} - ${color}`;

  const randomBoardLabelData: LabelDataModel = {
    color,
    name,
    idBoard,
  };

  return randomBoardLabelData;
}

// // For Labels Created On Card Directly
// export interface CardLabelDataModel {
//   color: string;
//   name?: string;
// }

export function prepareRandomCardLabelData(
  customColor?: string,
  labelName?: string,
  words?: number,
): CardLabelDataModel {
  // Solution I with faker - not recommended - faker generates colors not maintained by TRELLO app
  //   const color: string = customColor ? customColor : faker.color.human();

  // Solution II with choice of random color method
  // Prepare method which generates random color from array of colors
  const randomColorGenerator = (): string => {
    // INFO: Just Because Trello do not accept any random colors than example list is prepared without using faker
    const colors = [
      'green',
      'yellow',
      'red',
      'orange',
      'purple',
      'blue',
      'sky',
      'lime',
      'pink',
      'black',
    ];
    const randomColorIndex = Math.floor(Math.random() * colors.length);
    return colors[randomColorIndex];
  };

  const color: string = !customColor ? randomColorGenerator() : customColor;

  const name: string =
    labelName && labelName !== ''
      ? `${labelName} - ${faker.lorem.words(words ?? 1)} - ${color}`
      : labelName === ''
        ? `${faker.lorem.words(words ?? 1)} - ${color}`
        : '';

  const randomCardLabelData: CardLabelDataModel = {
    color,
    ...(name !== '' && { name }),
  };

  return randomCardLabelData;
}

// // For Adding Label To Card Only
// export interface LabelOperationsDataModel {
//   value?: string;
// }

export function prepareOperationData(
  element: string,
): LabelOperationsDataModel {
  const value = element;

  const chosenOperationData: LabelOperationsDataModel = {
    value,
  };

  return chosenOperationData;
}
