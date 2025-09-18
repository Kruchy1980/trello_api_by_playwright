export const stickerNameGenerator = (): string => {
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
