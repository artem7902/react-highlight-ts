export const getUrl = (i: number, text: string) => {
  const stringToTest = text.slice(i);
  const myRegexp = /^(https?:\/\/(?:www\.|(?!www))[^\s\.]+\.[^\s]{2,}|www\.[^\s]+\.[^\s]{2,})/g;
  const match = myRegexp.exec(stringToTest);

  return match && match.length ? match[1] : "";
};

export const debounce = (
  func: (args: any[]) => any,
  wait: number,
  immediate?: boolean
) => {
  let timeout: undefined | NodeJS.Timer | number;

  return function(this: any, ...args: any) {
    const context: any = this;
    const later = () => {
      timeout = undefined;
      func.apply(context, args);
    };
    const callNow = !!immediate && !!!timeout;
    if (!!timeout) clearTimeout(timeout as any);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
};
