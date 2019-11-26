import React from "react";

import Node from "./Node";
import HightlightRange from "../Range";

interface UrlNodeProps {
  id: string;
  highlightStyle?: object;
  charIndex: number;
  range: HightlightRange | null;
  url: string;
  style?: object;
}

const UrlNode: React.FC<UrlNodeProps> = props => {
  const getStyle = (range?: HightlightRange | null) =>
    range ? props.highlightStyle : props.style;
  return (
    <Node
      id={props.id}
      highlightStyle={
        !!props.range && props.range.style
          ? props.range.style
          : getStyle(props.range)
      }
      charIndex={props.charIndex}
      range={props.range}
    >
      <a
        data-position={props.charIndex + props.url.length}
        href={props.url}
        target="blank"
      >
        {props.url}
      </a>
    </Node>
  );
};

export default UrlNode;
