import React from "react";

import Node from "./Node";
import Range from "../Range";

interface UrlNodeProps {
  id: string;
  highlightStyle?: object;
  charIndex: number;
  range: Range|null;
  url: string;
}

const UrlNode: React.FC<UrlNodeProps> = props => {
  const style = { wordWrap: "break-word" };
  return (
    <Node
      id={props.id}
      highlightStyle={Object.assign({}, style, props.highlightStyle)}
      charIndex={props.charIndex}
      range={props.range}
      style={style}
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
