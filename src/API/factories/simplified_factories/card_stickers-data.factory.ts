import { generateStickerName } from '@_src/API/helpers/factories/data_generators/names_data_generator';
import {
  integerNumberGenerator,
  positionNumberGenerator,
  rotationNumberGenerator,
} from '@_src/API/helpers/factories/data_generators/numbers_generator';
import { CardStickerDataModel } from '@_src/API/models/card_stickers-data.model';

export function prepareRandomStickerDataSimplified(
  customImage?: string,
  fromTop?: number,
  fromLeft?: number,
  index?: number,
  rotation?: number,
): CardStickerDataModel {
  const image: string = generateStickerName(customImage);

  const left: number = positionNumberGenerator(fromLeft);

  const top: number = positionNumberGenerator(fromTop);

  const zIndex: number = integerNumberGenerator(index);

  const rotate: number = rotationNumberGenerator(rotation);

  const randomStickerData: CardStickerDataModel = {
    ...(image !== undefined && { image }),
    top,
    left,
    zIndex,
    ...(rotation && rotation !== null && { rotate }),
  };

  return randomStickerData;
}
