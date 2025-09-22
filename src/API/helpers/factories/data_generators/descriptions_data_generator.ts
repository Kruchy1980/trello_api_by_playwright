import { faker } from '@faker-js/faker';

// Fully extendable Description generator

export function generateRandomLargeDescription(
  description?: string,
  fakeDesc?: boolean,
  numberParagraphs?: number,
): string {
  const randomBoardDescription: string =
    description && fakeDesc
      ? `${description} - ${faker.lorem.paragraphs(numberParagraphs)}`
      : description && !fakeDesc
        ? `${description}`
        : faker.lorem.paragraphs(numberParagraphs);

  return randomBoardDescription;
}

// Simple Description generator
export function generateRandomSimpleDescription(
  description?: string,
  sentencesLength?: number,
): string {
  const randomListDescription: string = description
    ? `${description} - ${faker.lorem.sentences(sentencesLength ?? 1)}`
    : faker.lorem.sentences(sentencesLength ?? 1);

  return randomListDescription;
}

// Description with optional name length parameter
export function generateExtendableDescription(
  description?: string,
  length?: number,
): string {
  const randomExtendableDescription =
    description !== ''
      ? `${description} - ${faker.lorem.sentences(length ?? 1)}`
      : description === ''
        ? faker.lorem.sentences(length ?? 1)
        : '';

  return randomExtendableDescription;
}
