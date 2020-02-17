import HightlightRange from "../Range";
import HighlightPart from "./HighlightPart";
import ProcessChildrenNodesResult from "./ProcessChildrenNodesResult";

export interface HighlightableComponentModel {
  getRange: (charIndex: number) => HightlightRange | null;
  onMouseOverHighlightedWord: (
    range: HightlightRange | null,
    visible?: boolean
  ) => any;
  getLetterNode: (
    charIndex: number,
    range: HightlightRange | null,
    text: string
  ) => React.ReactElement;
  getEmojiNode: (
    charIndex: number,
    range: HightlightRange | null,
    text: string
  ) => React.ReactElement;
  getUrlNode: (
    charIndex: number,
    range: HightlightRange | null,
    text: string
  ) => React.ReactElement;
  mouseEvent: () => any;
  onMouseUp: () => any;
  onDoubleClick: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => any;
  rangeRenderer: (
    letterGroup: JSX.Element[],
    range: HightlightRange,
    textCharIndex: number,
    onMouseOverHighlightedWord: (range: HightlightRange | null) => void
  ) => void;
  getNode: (
    index: number,
    range: HightlightRange | null,
    text: string,
    url: string,
    isEmoji: boolean
  ) => React.ReactElement;
  processChildrenNodes: (
    highlightPart: HighlightPart,
    textInfo: { startPoint: number; joinedText: string }
  ) => ProcessChildrenNodesResult;
  getRanges: () => (React.ReactElement | React.ReactElement[])[];
}
