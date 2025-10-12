import { generateRandomColorData } from '@_src/API/helpers/factories/data_generators/color_data_generator';
import { generateNameWithColor } from '@_src/API/helpers/factories/data_generators/names_data_generator';
import { returnStringValue } from '@_src/API/helpers/factories/data_generators/values_generator';
import {
  LabelDataModelSimplified,
  LabelOperationsDataModelSimplified,
} from '@_src/API/models/card_label_new_version_model/card_label_model_simplified';

// // For Labels Created For Board
// export interface LabelDataModel {
//   color: string;
//   name: string;
//   idBoard: string;
// }

export function prepareRandomLabelDataSimplified(
  customColor?: string,
  labelName?: string,
  words?: number,
  boardId?: string,
): LabelDataModelSimplified {
  // // Solution II with choice of random color method
  // // Prepare method which generates random color from array of colors
  // const randomColorGenerator = (): string => {
  //   // INFO: Just Because Trello do not accept any random colors than example list is prepared without using faker
  //   const colors = [
  //     'green',
  //     'yellow',
  //     'red',
  //     'orange',
  //     'purple',
  //     'blue',
  //     'sky',
  //     'lime',
  //     'pink',
  //     'black',
  //   ];
  //   const randomColorIndex = Math.floor(Math.random() * colors.length);
  //   return colors[randomColorIndex];
  // };
  // const color: string = !customColor ? randomColorGenerator() : customColor;
  const idBoard: string = returnStringValue(boardId);

  // const color: string = customColor ? customColor : randomColorGenerator();
  const color: string = generateRandomColorData(customColor);

  // const name: string = labelName
  //   ? `${labelName} - ${faker.lorem.words(words ?? 1)} - ${color}`
  //   : `${faker.lorem.words(words ?? 1)} - ${color}`;
  const name: string = generateNameWithColor(labelName, words, color);

  const randomBoardLabelData: LabelDataModelSimplified = {
    ...(color && { color }),
    ...(name && { name }),
    ...(idBoard !== '' && { idBoard }),
  };

  return randomBoardLabelData;
}

// // For Labels Created On Card Directly
// export interface CardLabelDataModel {
//   color: string;
//   name?: string;
// }

// export function prepareRandomCardLabelData(
//   customColor?: string,
//   labelName?: string,
//   words?: number,
// ): CardLabelDataModel {
//   // Solution I with faker - not recommended - faker generates colors not maintained by TRELLO app
//   //   const color: string = customColor ? customColor : faker.color.human();

//   // Solution II with choice of random color method
//   // Prepare method which generates random color from array of colors
//   const randomColorGenerator = (): string => {
//     // INFO: Just Because Trello do not accept any random colors than example list is prepared without using faker
//     const colors = [
//       'green',
//       'yellow',
//       'red',
//       'orange',
//       'purple',
//       'blue',
//       'sky',
//       'lime',
//       'pink',
//       'black',
//     ];
//     const randomColorIndex = Math.floor(Math.random() * colors.length);
//     return colors[randomColorIndex];
//   };

//   const color: string = !customColor ? randomColorGenerator() : customColor;

//   const name: string =
//     labelName && labelName !== ''
//       ? `${labelName} - ${faker.lorem.words(words ?? 1)} - ${color}`
//       : labelName === ''
//         ? `${faker.lorem.words(words ?? 1)} - ${color}`
//         : '';

//   const randomCardLabelData: CardLabelDataModel = {
//     color,
//     ...(name !== '' && { name }),
//   };

//   return randomCardLabelData;
// }

// // For Adding Label To Card Only
// export interface LabelOperationsDataModel {
//   value?: string;
// }

// export function prepareOperationData(
//   element: string,
// ): LabelOperationsDataModel {
//   const value = element;

//   const chosenOperationData: LabelOperationsDataModel = {
//     value,
//   };

//   return chosenOperationData;
// }

// Simplified version for operations
export function prepareOperationDataSimplified(
  value: string,
): LabelOperationsDataModelSimplified {
  const chosenOperationData: LabelOperationsDataModelSimplified = {
    value,
  };

  return chosenOperationData;
}
