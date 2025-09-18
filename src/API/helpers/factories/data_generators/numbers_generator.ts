import { faker } from '@faker-js/faker';

export function positionNumberGenerator(number?: number): number {
  return number ? number : faker.number.float({ min: -60, max: 100 });
}

export function rotationNumberGenerator(number?: number): number {
  return number ? number : faker.number.float({ min: 0, max: 360 });
}

export function integerNumberGenerator(number?: number): number {
  return number ? Number(number) : faker.number.int({ min: 0, max: 4 });
}
