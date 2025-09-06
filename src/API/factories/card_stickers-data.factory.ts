import { CardStickerDataModel } from '@_src/API/models/card_stickers-data.model';
import { faker } from '@faker-js/faker';

export function prepareRandomStickerData(
  customImage?: string,
  fromTop?: number,
  fromLeft?: number,
  index?: number,
  rotation?: number,
): CardStickerDataModel {
  const stickerNameGenerator = (): string => {
    const builtInStickers = [
      'rocketship',
      'thumbsdown',
      'check',
      'heart',
      'taco-confused',
      'pete-completed',
    ];
    const randomIndex = Math.floor(Math.random() * builtInStickers.length);
    return builtInStickers[randomIndex];
  };
  const image: string =
    customImage !== '' && customImage !== undefined
      ? customImage
      : stickerNameGenerator();

  const left: number = fromLeft
    ? fromLeft
    : faker.number.float({ min: -60, max: 100 });

  const top: number = fromTop
    ? fromTop
    : faker.number.float({ min: -60, max: 100 });

  const zIndex: number = index
    ? Number(index)
    : faker.number.int({ min: 0, max: 4 });

  const rotate: number =
    rotation && rotation !== null
      ? rotation
      : faker.number.float({ min: 0, max: 360 });

  const randomStickerData: CardStickerDataModel = {
    ...(image !== undefined && { image }),
    top,
    left,
    zIndex,
    ...(rotation && rotation !== null && { rotate }),
  };

  return randomStickerData;
}
