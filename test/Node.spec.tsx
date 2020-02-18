import 'jsdom-global/register';
import sinon from 'sinon';
import React from 'react';
import { expect } from 'chai';
import Enzyme, { mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import Node from '../src/nodes/Node';

Enzyme.configure({ adapter: new Adapter() });

describe('Node component', function () {
  describe('with required props', function () {
    it('should render the component correctly', () => {
      const wrapper = mount(<Node id="test-id" charIndex={0} range={null}>test</Node>);
      const span = wrapper.find('span').get(0);
      expect(span.props["data-position"]).to.equal(0);
    });
    it('should use range style as highlightStyle', () => {
      const expectedStyle = {
        color: "black"
      };
      const wrapper = mount(<Node id="test-id" charIndex={0}
      highlightStyle={{
        color: "white"
      }}
      range={{
        start: 0, end: 4, text: "test", data: {}, style: expectedStyle
      }} >test</Node>);
      expect(wrapper.find("span").props().style).to.equal(expectedStyle);
    });
    it('should use passed highlightStyle as highlightStyle', () => {
      const expectedStyle = {
        color: "white"
      };
      const wrapper = mount(<Node id="test-id" charIndex={0}
      highlightStyle={expectedStyle}
      range={{
        start: 0, end: 4, text: "test", data: {}
      }}>test</Node>);
      expect(wrapper.find("span").props().style).to.equal(expectedStyle);
    });
    it('should use a normal key as a key', () => {
      const wrapper = mount(<Node id="test-id" charIndex={0} range={null}>test</Node>);
      expect(wrapper.find("span").key()).to.equal(`${"test-id"}-${0}`);
    });
    it('should use a range key as a key', () => {
      const wrapper = mount(<Node id="test-id" charIndex={0}
      range={{
        start: 0, end: 4, text: "test", data: {}
      }}>test</Node>);
      expect(wrapper.find("span").key()).to.equal(`${"test-id"}-${0}-${0}`);
    });
  });
});