type Shuffle = {
  (arr: string[]): string[];
};

export const shuffle: Shuffle = (arr) => {
  return arr
    .map((a): [number, string] => [Math.random(), a])
    .sort((a, b) => a[0] - b[0])
    .map((a) => a[1]);
};
