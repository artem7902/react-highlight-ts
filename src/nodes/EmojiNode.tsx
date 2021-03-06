import React from "react";

import Node from "./Node";
import HightlightRange from "../Range";

interface EmojiNodeProps {
  id: string;
  highlightStyle?: object;
  charIndex: number;
  range: HightlightRange | null;
  text: string;
}

const EmojiNode: React.FC<EmojiNodeProps> = props => {
  return (
    <Node
      id={props.id}
      highlightStyle={props.highlightStyle}
      charIndex={props.charIndex}
      range={props.range}
    >
      {`${props.text[props.charIndex]}${props.text[props.charIndex + 1]}`}
    </Node>
  );
};

export default EmojiNode;
