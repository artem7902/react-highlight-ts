import React from "react";

import HightlightRange from "../Range";

interface NodeProps {
  highlightStyle?: object;
  style?: object;
  id: string;
  charIndex: number;
  range: HightlightRange | null;
  children: React.ReactNode;
}

const Node: React.FC<NodeProps> = props => {
  const getStyle = (range?: HightlightRange | null) =>
    !!range
      ? !!range.style
        ? range.style
        : props.highlightStyle
      : props.style;
  const getRangeKey = () =>
    `${props.id}-${!!props.range ? props.range.start : 0}-${props.charIndex}`;
  const getNormalKey = () => `${props.id}-${props.charIndex}`;
  const getKey = (range?: HightlightRange | null) =>
    !!range ? getRangeKey() : getNormalKey();

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
