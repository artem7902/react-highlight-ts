import React, { Component } from "react";
import emojiRegex from "emoji-regex";

import Node from "./nodes/Node";
import Range from "./Range";
import UrlNode from "./nodes/UrlNode";
import { getUrl, debounce } from "./helpers";
import EmojiNode from "./nodes/EmojiNode";

interface HighlightableProps {
  ranges: Range[];
  id: string | number;
  text: string;
  enabled?: boolean;
  onMouseOverHighlightedWord?: (range?: Range) => void;
  onTextHighlighted?: (range?: Range) => void;
  highlightStyle?: object;
  style?: object;
  rangeRenderer?: (
    letterGroup: JSX.Element[],
    range: Range,
    textCharIndex: number,
    onMouseOverHighlightedWord: (range?: Range) => void
  ) => void;
}

export default class Highlightable extends Component<HighlightableProps> {
  public dismissMouseUp: number;
  public doucleckicked: boolean;
  constructor(props: HighlightableProps) {
    super(props);
    this.dismissMouseUp = 0;
    this.doucleckicked = false;
  }

  shouldComponentUpdate(newProps: HighlightableProps) {
    return (
      newProps.ranges.length !== this.props.ranges.length ||
      newProps.text !== this.props.text ||
      !!newProps.enabled !== !!this.props.enabled
    );
  }

  getRange(charIndex: number) {
    return (
      this.props.ranges &&
      this.props.ranges.find(
        range => charIndex >= range.start && charIndex <= range.end
      )
    );
  }

  onMouseOverHighlightedWord(range?: Range, visible?: boolean) {
    if (!!visible && this.props.onMouseOverHighlightedWord) {
      this.props.onMouseOverHighlightedWord(range);
    }
  }

  getLetterNode(charIndex: number, range: Range) {
    return (
      <Node
        id={String(this.props.id)}
        range={range}
        charIndex={charIndex}
        key={`${this.props.id}-${charIndex}`}
        highlightStyle={this.props.highlightStyle}
      >
        {this.props.text[charIndex]}
      </Node>
    );
  }

  getEmojiNode(charIndex: number, range: Range) {
    return (
      <EmojiNode
        text={this.props.text}
        id={String(this.props.id)}
        range={range}
        key={`${this.props.id}-emoji-${charIndex}`}
        charIndex={charIndex}
        highlightStyle={this.props.highlightStyle}
      />
    );
  }

  getUrlNode(charIndex: number, range: Range, url: string) {
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

    if (!text || !text.length) {
      return false;
    }

    const range = selection.getRangeAt(0);

    if (!!!range) return;

    const startContainerParent = range.startContainer.parentNode as any;
    const endContainerParent = range.startContainer.parentNode as any;

    const startContainerPosition = parseInt(
      !!startContainerParent ? startContainerParent.dataset.position : 0
    );
    const endContainerPosition = parseInt(
      !!endContainerParent ? endContainerParent.dataset.position : -1
    );

    const startHL =
      startContainerPosition < endContainerPosition
        ? startContainerPosition
        : endContainerPosition;
    const endHL =
      startContainerPosition < endContainerPosition
        ? endContainerPosition
        : startContainerPosition;

    const rangeObj = new Range(
      startHL,
      endHL,
      text,
      Object.assign({}, this.props, { ranges: undefined })
    );
    if (!!this.props.onTextHighlighted) this.props.onTextHighlighted(rangeObj);
  }

  onMouseUp() {
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

  onDoubleClick(event: any) {
    event.stopPropagation();

    this.doucleckicked = true;
    this.mouseEvent.bind(this)();
  }

  rangeRenderer(
    letterGroup: JSX.Element[],
    range: Range,
    textCharIndex: number,
    onMouseOverHighlightedWord: (range?: Range) => void
  ) {
    return this.props.rangeRenderer
      ? this.props.rangeRenderer(
          letterGroup,
          range,
          textCharIndex,
          onMouseOverHighlightedWord
        )
      : letterGroup;
  }

  getNode(
    i: number,
    range: Range,
    text: string,
    url: string,
    isEmoji: boolean
  ) {
    if (url.length) {
      return this.getUrlNode(i, range, url);
    } else if (isEmoji) {
      return this.getEmojiNode(i, range);
    }

    return this.getLetterNode(i, range);
  }

  getRanges() {
    const newText = [];
    let lastRange;

    // For all the characters on the text
    for (
      let textCharIndex = 0;
      textCharIndex < this.props.text.length;
      textCharIndex++
    ) {
      const range = this.getRange(textCharIndex);
      if (!!!range) return null;
      const url = getUrl(textCharIndex, this.props.text);
      const isEmoji = emojiRegex().test(
        this.props.text[textCharIndex] + this.props.text[textCharIndex + 1]
      );
      // Get the current character node
      const node = this.getNode(
        textCharIndex,
        range,
        this.props.text,
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

      if (!range) {
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
          `${this.props.text[rangeCharIndex]}${
            this.props.text[rangeCharIndex + 1]
          }`
        );

        if (isEmoji) {
          letterGroup.push(this.getEmojiNode(rangeCharIndex, range));
          // Because an emoji is composed of 2 chars
          rangeCharIndex++;
        } else {
          letterGroup.push(this.getLetterNode(rangeCharIndex, range));
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

    if (lastRange) {
      // Callback function
      this.onMouseOverHighlightedWord(lastRange, true);
    }

    return newText;
  }

  render() {
    const newText = this.getRanges();

    return (
      <div
        style={this.props.style}
        onMouseUp={this.onMouseUp.bind(this)}
        onDoubleClick={this.onDoubleClick.bind(this)}
      >
        {newText}
      </div>
    );
  }
}
