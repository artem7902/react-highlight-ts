import React from "react";

import Range from "../Range";

interface NodeProps {
  highlightStyle?: object;
  style?: object;
  id: string;
  charIndex: number;
  range: Range;
  children: React.ReactNode;
}

const Node: React.FC<NodeProps> = props => {
  const getStyle = (range: Range) =>
    range ? props.highlightStyle : props.style;
  const getRangeKey = () =>
    `${props.id}-${props.range.start}-${props.charIndex}`;
  const getNormalKey = () => `${props.id}-${props.charIndex}`;
  const getKey = (range: Range) => (!!range ? getRangeKey() : getNormalKey());

  return (
    <span
      data-position={props.charIndex}
      key={getKey(props.range)}
      style={getStyle(props.range)}
    >
      {props.children}
    </span>
  );
};

export default Node;
