export const getUrl = (i: number, text: string) => {
  const stringToTest = text.slice(i);
  const myRegexp = /^(https?:\/\/(?:www\.|(?!www))[^\s\.]+\.[^\s]{2,}|www\.[^\s]+\.[^\s]{2,})/g;
  const match = myRegexp.exec(stringToTest);

  return match && match.length ? match[1] : "";
};
