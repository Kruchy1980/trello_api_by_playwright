import { randomColorGenerator } from '@_src/API/helpers/factories/helper_functions/color_generator';

/*
const color: string = customColor ? customColor : randomColorGenerator();
*/
export function generateRandomColorData(colorName?: string): string {
  const randomColor: string = colorName ? colorName : randomColorGenerator();
  return randomColor;
}
