export default class HightlightRange {
  public start: number;
  public end: number;
  public text?: string;
  public data: object;
  public style?: object;
  constructor(
    start: number,
    end: number,
    text?: string,
    data: object = {},
    style?: object
  ) {
    this.start = start;
    this.end = end;
    if (!!text) this.text = text;
    this.style = style;
    this.data = data;
  }
}
