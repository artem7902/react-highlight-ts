export default class Range {
  public start: number;
  public end: number;
  public text?: string;
  public data: object;
  constructor(start: number, end: number, text?: string, data: object = {}) {
    this.start = start;
    this.end = end;
    if (!!text) this.text = text;
    this.data = data;
  }
}
