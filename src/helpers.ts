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
  let timeout: undefined | NodeJS.Timer;

  return function(this: any, ...args: any) {
    const context: any = this;
    const later = () => {
      timeout = undefined;
      if (!!immediate) func.apply(context, args);
    };
    const callNow = !!immediate && !!!timeout;
    if (!!timeout) clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
};
