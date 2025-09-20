import { generateRandomColorData } from '@_src/API/helpers/factories/data_generators/color_data_generator';
import { generateNameWithColor } from '@_src/API/helpers/factories/data_generators/names_data_generator';
import { returnStringValue } from '@_src/API/helpers/factories/data_generators/values_generator';
import {
  LabelDataModelSimplified,
  LabelOperationsDataModelSimplified,
} from '@_src/API/models/card_label_new_version_model/card_label_model_simplified';

// Labels handling factory simplified
export function prepareRandomLabelDataSimplified(
  customColor?: string,
  labelName?: string,
  words?: number,
  boardId?: string,
): LabelDataModelSimplified {
  const idBoard: string = returnStringValue(boardId);

  const color: string = generateRandomColorData(customColor);

  const name: string = generateNameWithColor(labelName, words, color);

  const randomBoardLabelData: LabelDataModelSimplified = {
    ...(color && { color }),
    ...(labelName !== undefined && { name }),
    ...(idBoard !== '' && { idBoard }),
  };

  return randomBoardLabelData;
}

// Simplified version for operations
export function prepareOperationDataSimplified(
  value: string,
): LabelOperationsDataModelSimplified {
  const chosenOperationData: LabelOperationsDataModelSimplified = {
    value,
  };

  return chosenOperationData;
}
