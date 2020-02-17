export default interface HighlightPart {
  parentElement: React.ReactElement;
  currentElement: React.ReactElement | React.ReactElement[] | string;
}
