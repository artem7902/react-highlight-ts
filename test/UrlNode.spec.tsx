import 'jsdom-global/register';
import sinon from 'sinon';
import React from 'react';
import { expect } from 'chai';
import Enzyme, { mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import UrlNode from '../src/nodes/UrlNode';

Enzyme.configure({ adapter: new Adapter() });

describe('UrlNode component', function () {
  describe('with required props', function () {
    it('should render the component correctly', () => {
      const url = "https://www.google.com";
      const wrapper = mount(<UrlNode id="test-id" charIndex={0} range={null} url={url}>test</UrlNode>);
      const a = wrapper.find('a').get(0);
      expect(a.props["data-position"]).to.equal(0+url.length);
      expect(a.props["href"]).to.equal(url);
    });
    it('should use range style as highlightStyle', () => {
      const expectedStyle = {
        color: "black"
      };
      const url = "https://www.google.com";
      const wrapper = mount(<UrlNode id="test-id" charIndex={0}
      highlightStyle={{
        color: "white"
      }}
      range={{
        start: 0, end: 4, text: "test", data: {}, style: expectedStyle
      }} url={url}>test</UrlNode>);
      const node = wrapper.find('span').get(0);
      expect(node.props.style).to.equal(expectedStyle);
    });
    it('should use passed highlightStyle as highlightStyle', () => {
      const expectedStyle = {
        color: "white"
      };
      const url = "https://www.google.com";
      const wrapper = mount(<UrlNode id="test-id" charIndex={0}
      highlightStyle={expectedStyle}
      range={{
        start: 0, end: 4, text: "test", data: {}
      }} url={url}>test</UrlNode>);
      const node = wrapper.find('span').get(0);
      expect(node.props.style).to.equal(expectedStyle);
    });
  });
});