import React, { Component } from "react";
import emojiRegex from "emoji-regex";
import debounce from "debounce";

import Node from "./nodes/Node";
import HightlightRange from "./Range";
import UrlNode from "./nodes/UrlNode";
import { getUrl } from "./helpers";
import EmojiNode from "./nodes/EmojiNode";

import HighlightPart from "./models/HighlightPart";
import ProcessChildrenNodesResult from "./models/ProcessChildrenNodesResult";
import { HighlightableComponentModel } from "./models/Highlightable";

const defaultRangeStyle = {
  backgroundColor: "#ffcc80"
};

interface HighlightableProps {
  ranges: HightlightRange[];
  id: string | number;
  text: React.ReactElement<any> | React.ReactElement<any>[] | string;
  enabled?: boolean;
  onMouseOverHighlightedWord?: (range: HightlightRange | null) => void;
  onTextHighlighted?: (range: HightlightRange | null) => void;
  highlightStyle?: object;
  style?: object;
  rangeRenderer?: (
    letterGroup: JSX.Element[],
    range: HightlightRange,
    textCharIndex: number,
    onMouseOverHighlightedWord: (range: HightlightRange | null) => void
  ) => void;
}

interface HighlightableState {
  highlightParts: HighlightPart[];
}

export default class Highlightable
  extends Component<HighlightableProps, HighlightableState>
  implements HighlightableComponentModel {
  public mouseDown: boolean;
  public range?: Range;
  public dismissMouseUp: number;
  public doucleckicked: boolean;
  state = {
    highlightParts: [] as HighlightPart[]
  };
  constructor(props: HighlightableProps) {
    super(props);
    this.dismissMouseUp = 0;
    this.doucleckicked = false;
    this.mouseDown = false;
  }

  shouldComponentUpdate(newProps: HighlightableProps) {
    return (
      newProps.ranges.length !== this.props.ranges.length ||
      newProps.text !== this.props.text ||
      !!newProps.enabled !== !!this.props.enabled
    );
  }

  getRange(charIndex: number) {
    const range =
      this.props.ranges &&
      this.props.ranges.find(
        range => charIndex >= range.start && charIndex <= range.end
      );
    return !!range ? range : null;
  }

  onMouseOverHighlightedWord(range: HightlightRange | null, visible?: boolean) {
    if (!!visible && this.props.onMouseOverHighlightedWord) {
      this.props.onMouseOverHighlightedWord(range);
    }
  }

  getLetterNode(
    charIndex: number,
    range: HightlightRange | null,
    text: string
  ) {
    return (
      <Node
        id={String(this.props.id)}
        range={range}
        charIndex={charIndex}
        key={`${this.props.id}-${charIndex}`}
        highlightStyle={this.props.highlightStyle}
      >
        {text[charIndex]}
      </Node>
    );
  }

  getEmojiNode(charIndex: number, range: HightlightRange | null, text: string) {
    return (
      <EmojiNode
        text={text}
        id={String(this.props.id)}
        range={range}
        key={`${this.props.id}-emoji-${charIndex}`}
        charIndex={charIndex}
        highlightStyle={this.props.highlightStyle}
      />
    );
  }

  getUrlNode(charIndex: number, range: HightlightRange | null, url: string) {
    return (
      <UrlNode
        url={url}
        id={String(this.props.id)}
        range={range}
        key={`${this.props.id}-url-${charIndex}`}
        charIndex={charIndex}
        highlightStyle={this.props.highlightStyle}
      />
    );
  }

  mouseEvent() {
    if (!!!this.props.enabled) {
      return false;
    }

    let text = "";

    const selection = window.getSelection();
    if (!!!selection) return;

    text = selection.toString();

    if (!!!text || !!!text.length) {
      text = "";
    }

    try {
      if (selection.rangeCount > 0) {
        this.range = selection.getRangeAt(0);
      }
      if (!!!this.range) return;
      const startContainerParent = this.range.startContainer.parentNode as any;
      const endContainerParent = this.range.endContainer.parentNode as any;

      let startContainerPosition = 0;
      let endContainerPosition = -1;
      if (
        !!!endContainerParent ||
        !!!endContainerParent.dataset ||
        !!!endContainerParent.dataset.position
      ) {
        if (
          !!this.range.endContainer.firstChild &&
          !!(this.range.endContainer.firstChild as any).dataset
        ) {
          startContainerPosition = parseInt(
            !!startContainerParent ? startContainerParent.dataset.position : 0
          );
          endContainerPosition =
            parseInt(
              (this.range.endContainer.firstChild as any).dataset.position
            ) - 1;
        }
      } else {
        startContainerPosition = parseInt(
          !!startContainerParent ? startContainerParent.dataset.position : 0
        );
        endContainerPosition = parseInt(
          !!endContainerParent ? endContainerParent.dataset.position : -1
        );
      }
      const startHL =
        startContainerPosition < endContainerPosition
          ? startContainerPosition
          : endContainerPosition;
      const endHL =
        startContainerPosition < endContainerPosition
          ? endContainerPosition
          : startContainerPosition;
      const rangeObj = new HightlightRange(
        startHL,
        endHL,
        text,
        Object.assign({}, this.props, { ranges: undefined })
      );
      if (!!this.props.onTextHighlighted)
        this.props.onTextHighlighted(rangeObj);
    } catch (e) {
      console.log(e);
    }
  }

  onMouseUp() {
    this.mouseDown = false;
    debounce(() => {
      if (this.doucleckicked) {
        this.doucleckicked = false;
        this.dismissMouseUp++;
      } else if (this.dismissMouseUp > 0) {
        this.dismissMouseUp--;
      } else {
        this.mouseEvent.bind(this)();
      }
    }, 200).bind(this)();
  }

  onDoubleClick(event: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    event.stopPropagation();

    this.doucleckicked = true;
    this.mouseEvent.bind(this)();
  }

  rangeRenderer(
    letterGroup: JSX.Element[],
    range: HightlightRange,
    textCharIndex: number,
    onMouseOverHighlightedWord: (range: HightlightRange | null) => void
  ) {
    return this.props.rangeRenderer ? (
      this.props.rangeRenderer(
        letterGroup,
        range,
        textCharIndex,
        onMouseOverHighlightedWord
      )
    ) : (
      <span
        key={`highlight-range-${textCharIndex}`}
        style={!!range.style ? range.style : defaultRangeStyle}
      >
        {letterGroup}
      </span>
    );
  }

  getNode(
    i: number,
    range: HightlightRange | null,
    text: string,
    url: string,
    isEmoji: boolean
  ) {
    if (url.length) {
      return this.getUrlNode(i, range, url);
    } else if (isEmoji) {
      return this.getEmojiNode(i, range, text);
    }

    return this.getLetterNode(i, range, text);
  }

  processChildrenNodes(
    highlightPart: HighlightPart,
    textInfo: { startPoint: number; joinedText: string }
  ): ProcessChildrenNodesResult {
    if (!!!highlightPart.currentElement) {
      if (!!highlightPart.parentElement)
        return {
          textLength: textInfo.joinedText.length,
          element: React.cloneElement(highlightPart.parentElement)
        };
      else {
        throw Error(
          "At least parent element should be passed to the processChildrenNodes function!"
        );
      }
    }
    if (typeof highlightPart.currentElement === "string") {
      const stringToInsert = highlightPart.currentElement;
      textInfo.joinedText += stringToInsert;
      const newText = [];
      let lastRange;
      // For all the characters on the text
      for (
        let textCharIndex = textInfo.startPoint;
        textCharIndex < textInfo.startPoint + stringToInsert.length;
        textCharIndex++
      ) {
        const range = this.getRange(textCharIndex);
        //if (!!!range) return null;
        const url = getUrl(textCharIndex, textInfo.joinedText);
        const isEmoji = emojiRegex().test(
          textInfo.joinedText[textCharIndex] +
            textInfo.joinedText[textCharIndex + 1]
        );
        // Get the current character node
        const node = this.getNode(
          textCharIndex,
          range,
          textInfo.joinedText,
          url,
          isEmoji
        );

        // If the next node is an url one, we fast forward to the end of it
        if (url.length) {
          textCharIndex += url.length - 1;
        } else if (isEmoji) {
          // Because an emoji is composed of 2 chars
          textCharIndex++;
        }

        if (!!!range) {
          newText.push(node);
          continue;
        }

        // If the char is in range
        lastRange = range;
        // We put the first range node on the array
        const letterGroup = [node];

        // For all the characters in the highlighted range
        let rangeCharIndex = textCharIndex + 1;

        for (
          ;
          rangeCharIndex < parseInt(String(range.end)) + 1;
          rangeCharIndex++
        ) {
          const isEmoji = emojiRegex().test(
            `${textInfo.joinedText[rangeCharIndex]}${
              textInfo.joinedText[rangeCharIndex + 1]
            }`
          );

          if (isEmoji) {
            letterGroup.push(
              this.getEmojiNode(rangeCharIndex, range, textInfo.joinedText)
            );
            // Because an emoji is composed of 2 chars
            rangeCharIndex++;
          } else {
            letterGroup.push(
              this.getLetterNode(rangeCharIndex, range, textInfo.joinedText)
            );
          }

          textCharIndex = rangeCharIndex;
        }

        newText.push(
          this.rangeRenderer(
            letterGroup,
            range,
            textCharIndex,
            this.onMouseOverHighlightedWord.bind(this)
          )
        );
      }
      textInfo.startPoint = textInfo.startPoint + stringToInsert.length;
      if (lastRange) {
        // Callback function
        this.onMouseOverHighlightedWord(lastRange, true);
      }
      if (!!highlightPart.parentElement)
        return {
          textLength: textInfo.joinedText.length,
          element: React.cloneElement(highlightPart.parentElement, {
            ...highlightPart.parentElement.props,
            children: newText
          })
        };
      else
        return {
          textLength: textInfo.joinedText.length,
          element: newText as React.ReactElement[]
        };
    } else if (!!Array.isArray(highlightPart.currentElement)) {
      const processedNodes: any = [];
      highlightPart.currentElement.forEach((child: any) => {
        processedNodes.push(
          this.processChildrenNodes(
            {
              parentElement: typeof child === "string" ? null : child,
              currentElement:
                typeof child === "string" ? child : child.props.children
            },
            textInfo
          )
        );
      });
      return {
        textLength: textInfo.joinedText.length,
        element: React.cloneElement(highlightPart.parentElement, {
          ...highlightPart.parentElement.props,
          children: processedNodes.map((item: any) => item.element)
        })
      };
    } else {
      const processedNodes = [];
      processedNodes.push(
        this.processChildrenNodes(
          {
            parentElement: highlightPart.currentElement,
            currentElement: highlightPart.currentElement.props.children
          },
          textInfo
        )
      );
      return {
        textLength: textInfo.joinedText.length,
        element: React.cloneElement(highlightPart.parentElement, {
          ...highlightPart.parentElement.props,
          children: processedNodes.map(item => item.element)
        })
      };
    }
  }

  getRanges(): (React.ReactElement | React.ReactElement[])[] {
    const highlightParts: HighlightPart[] = [];
    if (!!this.props.text && typeof this.props.text === "string") {
      highlightParts.push({
        parentElement: <div></div>,
        currentElement: this.props.text
      });
    } else if (Array.isArray(this.props.text)) {
      this.props.text.forEach(item => {
        highlightParts.push({
          parentElement: item,
          currentElement: item.props.children
        });
      });
    } else {
      highlightParts.push({
        parentElement: this.props.text as any,
        currentElement: (this.props.text as any).props.children as any
      });
    }
    let startPoint = 0;
    const toReturn = highlightParts.map(item => {
      const processResult = this.processChildrenNodes(item, {
        startPoint,
        joinedText: ""
      });
      startPoint += processResult.textLength;
      return processResult.element;
    });
    return toReturn;
  }

  render() {
    const newText = this.getRanges();
    return (
      <div
        style={this.props.style}
        onMouseMove={() => {
          if (!!!this.mouseDown) return;
          const selection = window.getSelection();
          if (!!!selection) return;
          if (selection.rangeCount > 0) {
            this.range = selection.getRangeAt(0);
          }
        }}
        onMouseDown={() => {
          this.mouseDown = true;
        }}
        onMouseUp={this.onMouseUp.bind(this)}
        onDoubleClick={this.onDoubleClick.bind(this)}
      >
        {newText}
      </div>
    );
  }
}
