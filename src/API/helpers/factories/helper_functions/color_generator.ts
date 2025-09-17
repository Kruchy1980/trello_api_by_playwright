export const randomColorGenerator = (): string => {
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
