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
  });
});