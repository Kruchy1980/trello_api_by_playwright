import { stickerNameGenerator } from '@_src/API/helpers/factories/helper_functions/sticker_name_genrator';
import { faker } from '@faker-js/faker';

// Fully extendable name generator

export function generateRandomLargeName(
  name?: string,
  fake?: boolean,
  numberOfCharacters?: number,
): string {
  const randomLargeName: string =
    name && fake
      ? `${name} - ${faker.word.sample(numberOfCharacters ?? 1)}`
      : name && !fake
        ? `${name}`
        : faker.word.sample(numberOfCharacters ?? 1);

  return randomLargeName;
}

// Not extendable name length generator method
export function generateRandomSimpleName(name?: string): string {
  const randomSimpleName: string = name
    ? `${name} - ${faker.word.sample()}`
    : faker.word.sample();

  return randomSimpleName;
}

// Name with optional name length parameter
export function generateExtendableName(name?: string, length?: number): string {
  const randomExtendableName =
    name !== ''
      ? `${name} - ${faker.lorem.words(length ?? 1)}`
      : name === ''
        ? faker.lorem.words(length ?? 1)
        : '';

  return randomExtendableName;
}

// Name with random sticker
export function generateStickerName(image?: string): string {
  const returnedImage: string =
    image !== '' && image !== undefined ? image : stickerNameGenerator();
  return returnedImage;
}

// Name with additional created value added
export function generateNameWithColor(
  labelName?: string,
  words?: number,
  color?: string,
): string {
  const randomNameColor: string =
    labelName !== '' && color
      ? `${labelName} - ${faker.lorem.words(words ?? 1)} - ${color}`
      : labelName === '' && color
        ? `${faker.lorem.words(words ?? 1)} - ${color}`
        : faker.lorem.words(words ?? 1);

  return randomNameColor;
}
