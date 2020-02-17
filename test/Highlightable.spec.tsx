import 'jsdom-global/register';
import sinon from 'sinon';
import React from 'react';
import { expect } from 'chai';
import Enzyme, { mount, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import Highlightable, { HightlightRange } from '../src';
import { SelectionImpl, RangeImpl } from './utils';
import { HighlightableComponentModel } from "../src/models/Highlightable";
import HighlightPart from '../src/models/HighlightPart';

Enzyme.configure({ adapter: new Adapter() });

describe('Highlightable component with text as string', function () {
  describe('with basic props', function () {
    it('should render the text without highlight', () => {
      const onMouseOverHighlightedWord = sinon.spy();
      const onTextHighlighted = sinon.spy();
      const range: any[] = [];
      const text = 'test the text';

      const wrapper = mount(<Highlightable
           ranges={range}
           enabled={true}
           onTextHighlighted={onTextHighlighted}
           id={'test'}
           onMouseOverHighlightedWord={onMouseOverHighlightedWord}
           rangeRenderer={(a, b) => b}
           highlightStyle={{
             backgroundColor: '#ffcc80',
             enabled: true
           }}
           text={text}
        />);
      expect(onMouseOverHighlightedWord).to.have.property('callCount', 0);
      expect(onTextHighlighted).to.have.property('callCount', 0);

      expect(wrapper.containsMatchingElement(<span>t</span>)).to.equal(true);
      expect(wrapper.containsMatchingElement(<span>e</span>)).to.equal(true);
      expect(wrapper.containsMatchingElement(<span>s</span>)).to.equal(true);

      wrapper.find('span').forEach((w, index) => {
        const props: any = w.props();
        expect(props['data-position']).to.equal(index);
        expect(props.style).to.equal(undefined);
        expect(props.children).to.equal(text[index]);
      });
    });
  });

  describe('with range props', function () {
    it('should render with highlighted text', () => {
      const onMouseOverHighlightedWord = sinon.spy();
      const onTextHighlighted = sinon.spy();
      const range = [new HightlightRange(0, 5)];
      const text = 'test the text';

      const wrapper = mount(<Highlightable
           ranges={range}
           enabled={true}
           onTextHighlighted={onTextHighlighted}
           id={'test'}
           onMouseOverHighlightedWord={onMouseOverHighlightedWord}
           rangeRenderer={a => a}
           highlightStyle={{
             backgroundColor: '#ffcc80',
             enabled: true
           }}
           text={text}
        />);

      expect(onMouseOverHighlightedWord).to.have.property('callCount', 1);
      expect(onTextHighlighted).to.have.property('callCount', 0);

      expect(wrapper.containsMatchingElement(<span>t</span>)).to.equal(true);
      expect(wrapper.containsMatchingElement(<span>e</span>)).to.equal(true);
      expect(wrapper.containsMatchingElement(<span>s</span>)).to.equal(true);

      wrapper.find('span').forEach((w, index) => {
        const props: any = w.props();
        if(index < 6) {
          expect(props['data-position']).to.equal(index);
          expect(props.children).to.equal(text[index]);
        } else {
          expect(props['data-position']).to.equal(index);
          expect(props.style).to.equal(undefined);
          expect(props.children).to.equal(text[index]);
        }
      });

      wrapper.find('p').forEach((w) => {
        const props: any = w.props();
        expect(props.style.backgroundColor).to.equal('#ffcc80');
        expect(props.style.enabled).to.equal(true);
        expect(props.children).to.length(text.length);
      });
    });
  });

  describe('testing update', function () {
    it('should highlight text', () => {
      const onMouseOverHighlightedWord = sinon.spy();
      const onTextHighlighted = sinon.spy();
      const range = [] as any[];
      const text = 'test the text';

      const wrapper = mount(<Highlightable
            id={'test'}
           ranges={range}
           enabled={true}
           onTextHighlighted={onTextHighlighted}
           onMouseOverHighlightedWord={onMouseOverHighlightedWord}
           //rangeRenderer={a => a}
           highlightStyle={{
             backgroundColor: '#ffcc80',
             enabled: true
           }}
           text={text}
        />);

      expect(onMouseOverHighlightedWord).to.have.property('callCount', 0);
      expect(onTextHighlighted).to.have.property('callCount', 0);

      expect(wrapper.containsMatchingElement(<span>t</span>)).to.equal(true);
      expect(wrapper.containsMatchingElement(<span>e</span>)).to.equal(true);
      expect(wrapper.containsMatchingElement(<span>s</span>)).to.equal(true);

      wrapper.find('span').forEach((w, index) => {
        const props: any = w.props();
        expect(props['data-position']).to.equal(index);
        expect(props.style).to.equal(undefined);
        expect(props.children).to.equal(text[index]);
      });

      const newRange = [new HightlightRange(0, 5)];

      wrapper.setProps({ ranges: newRange });

      expect(onMouseOverHighlightedWord).to.have.property('callCount', 1);
      const props: any = wrapper.find('span').get(0).props;
      expect(props.style.backgroundColor).to.equal('#ffcc80');
      expect(props.children).to.length(6);
      // 13 letters + 1 span wrapper for the selected range
      expect(wrapper.find('span')).to.length(14);
    });
  });

  describe('with smiley', function () {
    it('should highlight text and keep the smiley at the end of the text', () => {
      const onMouseOverHighlightedWord = sinon.spy();
      const onTextHighlighted = sinon.spy();
      const range: any[] = [];
      const text = 'test the text 😘';

      const wrapper = mount(<Highlightable
           ranges={range}
           enabled={true}
           onTextHighlighted={onTextHighlighted}
           id={'test'}
           onMouseOverHighlightedWord={onMouseOverHighlightedWord}
           rangeRenderer={a => a}
           highlightStyle={{
             backgroundColor: '#ffcc80',
             enabled: true
           }}
           text={text}
        />);

      expect(wrapper.containsMatchingElement(<span>😘</span>)).to.equal(true);
    });

    it('should highlight text and keep the smiley at the end of the highlighted text', () => {
      const onMouseOverHighlightedWord = sinon.spy();
      const onTextHighlighted = sinon.spy();
      const range = [new HightlightRange(13, 14)];
      const text = 'test the text 😘';

      const wrapper = mount(<Highlightable
           ranges={range}
           enabled={true}
           onTextHighlighted={onTextHighlighted}
           id={'test'}
           onMouseOverHighlightedWord={onMouseOverHighlightedWord}
           rangeRenderer={a => a}
           highlightStyle={{
             backgroundColor: '#ffcc80',
             enabled: true
           }}
           text={text}
        />);

      expect(wrapper.containsMatchingElement(<span>😘</span>)).to.equal(true);

      expect(onMouseOverHighlightedWord).to.have.property('callCount', 1);
    });

    it('should highlight text and keep the smiley in the middle of the highlighted text', () => {
      const onMouseOverHighlightedWord = sinon.spy();
      const onTextHighlighted = sinon.spy();
      const range = [new HightlightRange(13, 18)];
      const text = 'test the text 😘 test again';

      const wrapper = mount(<Highlightable
           ranges={range}
           enabled={true}
           onTextHighlighted={onTextHighlighted}
           id={'test'}
           onMouseOverHighlightedWord={onMouseOverHighlightedWord}
           rangeRenderer={a => a}
           highlightStyle={{
             backgroundColor: '#ffcc80',
             enabled: true
           }}
           text={text}
        />);

      expect(wrapper.containsMatchingElement(<span>😘</span>)).to.equal(true);

      expect(onMouseOverHighlightedWord).to.have.property('callCount', 1);
    });
  });

  describe('with url', function () {
    it('should render with url', () => {
      const onMouseOverHighlightedWord = sinon.spy();
      const onTextHighlighted = sinon.spy();
      const range = [] as any[];
      const text = 'test http://www.google.fr';

      const wrapper = mount(<Highlightable
           ranges={range}
           enabled={true}
           onTextHighlighted={onTextHighlighted}
           id={'test'}
           onMouseOverHighlightedWord={onMouseOverHighlightedWord}
           rangeRenderer={a => a}
           highlightStyle={{
             backgroundColor: '#ffcc80',
             enabled: true
           }}
           text={text}
        />);

      expect(wrapper.containsMatchingElement(<a>http://www.google.fr</a>)).to.equal(true);
    });

    it('should render with highlighted url', () => {
      const onMouseOverHighlightedWord = sinon.spy();
      const onTextHighlighted = sinon.spy();
      const range = [new HightlightRange(5, 7)];
      const text = 'test http://www.google.fr';

      const wrapper = mount(<Highlightable
           ranges={range}
           enabled={true}
           onTextHighlighted={onTextHighlighted}
           id={'test'}
           onMouseOverHighlightedWord={onMouseOverHighlightedWord}
           rangeRenderer={a => a}
           highlightStyle={{
             backgroundColor: '#ffcc80',
             enabled: true
           }}
           text={text}
        />);

      expect(onMouseOverHighlightedWord).to.have.property('callCount', 1);
      expect(onTextHighlighted).to.have.property('callCount', 0);

      expect(wrapper.containsMatchingElement(<a>http://www.google.fr</a>)).to.equal(true);
    });
  });
});

describe('Highlightable component with text as react component', function () {
  describe('with basic props', function () {
    it('should render the text without highlight', () => {
      const onMouseOverHighlightedWord = sinon.spy();
      const onTextHighlighted = sinon.spy();
      const range: any[] = [];
      const text = <><p>Test text</p><p>Test Text 2</p></>;

      const wrapper = mount(<Highlightable
           ranges={range}
           enabled={true}
           onTextHighlighted={onTextHighlighted}
           id={'test'}
           onMouseOverHighlightedWord={onMouseOverHighlightedWord}
           rangeRenderer={(a, b) => b}
           highlightStyle={{
             backgroundColor: '#ffcc80',
             enabled: true
           }}
           text={text}
        />);
      expect(onMouseOverHighlightedWord).to.have.property('callCount', 0);
      expect(onTextHighlighted).to.have.property('callCount', 0);

      expect(wrapper.containsMatchingElement(<span>T</span>)).to.equal(true);
      expect(wrapper.containsMatchingElement(<span>e</span>)).to.equal(true);
      expect(wrapper.containsMatchingElement(<span>s</span>)).to.equal(true);

      wrapper.find('span').forEach((w, index) => {
        const props: any = w.props();
        expect(props['data-position']).to.equal(index);
        expect(props.style).to.equal(undefined);
      });
    });
  });

  describe('with range props', function () {
    it('should render with highlighted text', () => {
      const onMouseOverHighlightedWord = sinon.spy();
      const onTextHighlighted = sinon.spy();
      const range = [new HightlightRange(0, 3)];
      const text = <><p>Test text</p><p>Test Text 2</p></>;

      const wrapper = mount(<Highlightable
           ranges={range}
           enabled={true}
           onTextHighlighted={onTextHighlighted}
           id={'test'}
           onMouseOverHighlightedWord={onMouseOverHighlightedWord}
           rangeRenderer={a => a}
           highlightStyle={{
             backgroundColor: '#ffcc80',
             enabled: true
           }}
           text={text}
        />);

      expect(onMouseOverHighlightedWord).to.have.property('callCount', 1);
      expect(onTextHighlighted).to.have.property('callCount', 0);

      expect(wrapper.containsMatchingElement(<span>T</span>)).to.equal(true);
      expect(wrapper.containsMatchingElement(<span>e</span>)).to.equal(true);
      expect(wrapper.containsMatchingElement(<span>s</span>)).to.equal(true);
      expect(wrapper.containsMatchingElement(<span>t</span>)).to.equal(true);

      wrapper.find('p').forEach((w, index) => {
        const props: any = w.props();
        if(!!!index){
          expect(props.children[0]).to.have.length(4);
        }
        else{
          expect(props.children.length).to.greaterThan(0);
        }
      });
    });
  });

  describe('testing update', function () {
    it('should highlight text', () => {
      const onMouseOverHighlightedWord = sinon.spy();
      const onTextHighlighted = sinon.spy();
      const range = [] as any[];
      const text = <><p>Test text</p><p>Test Text 2</p></>;

      const wrapper = mount(<Highlightable
            id={'test'}
           ranges={range}
           enabled={true}
           onTextHighlighted={onTextHighlighted}
           onMouseOverHighlightedWord={onMouseOverHighlightedWord}
           //rangeRenderer={a => a}
           highlightStyle={{
             backgroundColor: '#ffcc80',
             enabled: true
           }}
           text={text}
        />);

      expect(onMouseOverHighlightedWord).to.have.property('callCount', 0);
      expect(onTextHighlighted).to.have.property('callCount', 0);

      expect(wrapper.containsMatchingElement(<span>T</span>)).to.equal(true);
      expect(wrapper.containsMatchingElement(<span>e</span>)).to.equal(true);
      expect(wrapper.containsMatchingElement(<span>s</span>)).to.equal(true);

      wrapper.find('span').forEach((w, index) => {
        const props: any = w.props();
        expect(props['data-position']).to.equal(index);
        expect(props.style).to.equal(undefined);
        //expect(props.children).to.equal(text[index]);
      });

      const newRange = [new HightlightRange(0, 5)];

      wrapper.setProps({ ranges: newRange });

      expect(onMouseOverHighlightedWord).to.have.property('callCount', 1);
      const props: any = wrapper.find('span').get(0).props;
      expect(props.style.backgroundColor).to.equal('#ffcc80');
      expect(props.children).to.length(6);
      expect(wrapper.find('span')).to.length(21);
    });
  });

  describe('with smiley', function () {
    it('should highlight text and keep the smiley at the end of the highlighted text', () => {
      const onMouseOverHighlightedWord = sinon.spy();
      const onTextHighlighted = sinon.spy();
      const range = [new HightlightRange(12, 24)];
      const text = <><p>Test text 😘</p><p>Test Text 2 😘</p></>;

      const wrapper = mount(<Highlightable
           ranges={range}
           enabled={true}
           onTextHighlighted={onTextHighlighted}
           id={'test'}
           onMouseOverHighlightedWord={onMouseOverHighlightedWord}
           rangeRenderer={a => a}
           highlightStyle={{
             backgroundColor: '#ffcc80',
             enabled: true
           }}
           text={text}
        />);

      expect(wrapper.containsMatchingElement(<span>😘</span>)).to.equal(true);

      expect(onMouseOverHighlightedWord).to.have.property('callCount', 1);
    });
  });

  describe('with url', function () {
    it('should render with url', () => {
      const onMouseOverHighlightedWord = sinon.spy();
      const onTextHighlighted = sinon.spy();
      const range = [] as any[];
      const text = <><p>Test text http://www.google.fr</p><p>Test Text 2 </p></>

      const wrapper = mount(<Highlightable
           ranges={range}
           enabled={true}
           onTextHighlighted={onTextHighlighted}
           id={'test'}
           onMouseOverHighlightedWord={onMouseOverHighlightedWord}
           rangeRenderer={a => a}
           highlightStyle={{
             backgroundColor: '#ffcc80',
             enabled: true
           }}
           text={text}
        />);

      expect(wrapper.containsMatchingElement(<a>http://www.google.fr</a>)).to.equal(true);
    });

    it('should render with highlighted url', () => {
      const onMouseOverHighlightedWord = sinon.spy();
      const onTextHighlighted = sinon.spy();
      const range = [new HightlightRange(11, 13)];
      const text = <><p>Test text http://www.google.fr</p><p>Test Text 2 </p></>

      const wrapper = mount(<Highlightable
           ranges={range}
           enabled={true}
           onTextHighlighted={onTextHighlighted}
           id={'test'}
           onMouseOverHighlightedWord={onMouseOverHighlightedWord}
           rangeRenderer={a => a}
           highlightStyle={{
             backgroundColor: '#ffcc80',
             enabled: true
           }}
           text={text}
        />);
      expect(onTextHighlighted).to.have.property('callCount', 0);

      expect(wrapper.containsMatchingElement(<a>http://www.google.fr</a>)).to.equal(true);
    });
  });
  describe('with mouse events', function () {
    it('should call mouse event if double click on wrap component', () => {
      const onMouseOverHighlightedWord = sinon.spy();
      const onTextHighlighted = sinon.spy();
      const range: any[] = [];
      const text = <><p>Test text</p><p>Test Text 2</p></>;

      const wrapper = mount(
      <Highlightable
        ranges={range}
        enabled={true}
        onTextHighlighted={onTextHighlighted}
        id={'test'}
        onMouseOverHighlightedWord={onMouseOverHighlightedWord}
        rangeRenderer={(a, b) => b}
        highlightStyle={{
          backgroundColor: '#ffcc80',
          enabled: true
        }}
        text={text}/>
      );
      const wDiv = wrapper.find('div').get(0);
      const firstPNode = wrapper.find('p').first().getDOMNode();
      expect(!!wDiv).to.equal(true);
      // Add selection Object manually
      const selection = new SelectionImpl();
      const selectionRange = new RangeImpl();
      selectionRange.setStart(firstPNode, 0)
      selectionRange.setEnd(firstPNode, 5)
      selection.addRange(selectionRange)
      const anyGlobal: any = global;
      anyGlobal.window.getSelection = () => selection;
      wrapper.simulate("doubleclick");
      expect(onTextHighlighted).to.have.property('callCount', 1);
      expect(wrapper.containsMatchingElement(<span>T</span>)).to.equal(true);
      expect(wrapper.containsMatchingElement(<span>e</span>)).to.equal(true);
      expect(wrapper.containsMatchingElement(<span>s</span>)).to.equal(true);
      expect(wrapper.containsMatchingElement(<span>t</span>)).to.equal(true);
    });
    it('should call mouse event if mouse up on wrap component after 200ms delay', async () => {
      const onMouseOverHighlightedWord = sinon.spy();
      const onTextHighlighted = sinon.spy();
      const range: any[] = [];
      const text = <><p>Test text</p><p>Test Text 2</p></>;

      const wrapper = mount(
      <Highlightable
        ranges={range}
        enabled={true}
        onTextHighlighted={onTextHighlighted}
        id={'test'}
        onMouseOverHighlightedWord={onMouseOverHighlightedWord}
        rangeRenderer={(a, b) => b}
        highlightStyle={{
          backgroundColor: '#ffcc80',
          enabled: true
        }}
        text={text}/>
      );
      const wDiv = wrapper.find('div').get(0);
      const firstPNode = wrapper.find('p').first().getDOMNode();
      expect(!!wDiv).to.equal(true);
      // Add selection Object manually
      const selection = new SelectionImpl();
      const selectionRange = new RangeImpl();
      selectionRange.setStart(firstPNode, 0)
      selectionRange.setEnd(firstPNode, 5)
      selection.addRange(selectionRange)
      const anyGlobal: any = global;
      anyGlobal.window.getSelection = () => selection;
      wrapper.simulate("mouseup");
      await new Promise((res,rej) => {
        setTimeout(() => res(), 300)
      });
      expect(onTextHighlighted).to.have.property('callCount', 1);
      expect(wrapper.containsMatchingElement(<span>T</span>)).to.equal(true);
      expect(wrapper.containsMatchingElement(<span>e</span>)).to.equal(true);
      expect(wrapper.containsMatchingElement(<span>s</span>)).to.equal(true);
      expect(wrapper.containsMatchingElement(<span>t</span>)).to.equal(true);
    });
    it('should not call mouse event if mouse up on wrap component after and enabled property is false 200ms delay', async () => {
      const onMouseOverHighlightedWord = sinon.spy();
      const onTextHighlighted = sinon.spy();
      const range: any[] = [];
      const text = <><p>Test text</p><p>Test Text 2</p></>;

      const wrapper = mount(
      <Highlightable
        ranges={range}
        enabled={false}
        onTextHighlighted={onTextHighlighted}
        id={'test'}
        onMouseOverHighlightedWord={onMouseOverHighlightedWord}
        rangeRenderer={(a, b) => b}
        highlightStyle={{
          backgroundColor: '#ffcc80',
          enabled: true
        }}
        text={text}
        />
      );
      const wDiv = wrapper.find('div').get(0);
      const firstPNode = wrapper.find('p').first().getDOMNode();
      expect(!!wDiv).to.equal(true);
      // Add selection Object manually
      const selection = new SelectionImpl();
      const selectionRange = new RangeImpl();
      selectionRange.setStart(firstPNode, 0)
      selectionRange.setEnd(firstPNode, 5)
      selection.addRange(selectionRange)
      const anyGlobal: any = global;
      anyGlobal.window.getSelection = () => selection;
      wrapper.simulate("mouseup");
      await new Promise((res,rej) => {
        setTimeout(() => res(), 300)
      });
      expect(onTextHighlighted).to.have.property('callCount', 0);
      expect(wrapper.containsMatchingElement(<span>T</span>)).to.equal(true);
      expect(wrapper.containsMatchingElement(<span>e</span>)).to.equal(true);
      expect(wrapper.containsMatchingElement(<span>s</span>)).to.equal(true);
      expect(wrapper.containsMatchingElement(<span>t</span>)).to.equal(true);
    });
    it('should not call mouse event if mouse up on wrap component  and selection is undefined after 200ms dela', async () => {
      const onMouseOverHighlightedWord = sinon.spy();
      const onTextHighlighted = sinon.spy();
      const range: any[] = [];
      const text = <><p>Test text</p><p>Test Text 2</p></>;

      const wrapper = mount(
      <Highlightable
        ranges={range}
        enabled={true}
        onTextHighlighted={onTextHighlighted}
        id={'test'}
        onMouseOverHighlightedWord={onMouseOverHighlightedWord}
        rangeRenderer={(a, b) => b}
        highlightStyle={{
          backgroundColor: '#ffcc80',
          enabled: true
        }}
        text={text}
        />
      );
      const wDiv = wrapper.find('div').get(0);
      const firstPNode = wrapper.find('p').first().getDOMNode();
      expect(!!wDiv).to.equal(true);
      // Add selection Object manually
      const selection = undefined;
      const selectionRange = new RangeImpl();
      selectionRange.setStart(firstPNode, 0)
      selectionRange.setEnd(firstPNode, 5)
      const anyGlobal: any = global;
      anyGlobal.window.getSelection = () => selection;
      wrapper.simulate("mouseup");
      await new Promise((res,rej) => {
        setTimeout(() => res(), 300)
      });
      expect(onTextHighlighted).to.have.property('callCount', 0);
      expect(wrapper.containsMatchingElement(<span>T</span>)).to.equal(true);
      expect(wrapper.containsMatchingElement(<span>e</span>)).to.equal(true);
      expect(wrapper.containsMatchingElement(<span>s</span>)).to.equal(true);
      expect(wrapper.containsMatchingElement(<span>t</span>)).to.equal(true);
    });
    it('should not call mouse event if mouse up on wrap component and selection.toString() is null after 200ms delay', async () => {
      const onMouseOverHighlightedWord = sinon.spy();
      const onTextHighlighted = sinon.spy();
      const range: any[] = [];
      const text = <><p>Test text</p><p>Test Text 2</p></>;

      const wrapper = mount(
      <Highlightable
        ranges={range}
        enabled={true}
        onTextHighlighted={onTextHighlighted}
        id={'test'}
        onMouseOverHighlightedWord={onMouseOverHighlightedWord}
        rangeRenderer={(a, b) => b}
        highlightStyle={{
          backgroundColor: '#ffcc80',
          enabled: true
        }}
        text={text}
        />
      );
      const wDiv = wrapper.find('div').get(0);
      const firstPNode = wrapper.find('p').first().getDOMNode();
      expect(!!wDiv).to.equal(true);
      // Add selection Object manually
      const selection = new SelectionImpl();
      const anyGlobal: any = global;
      anyGlobal.window.getSelection = () => selection;
      wrapper.simulate("mouseup");
      await new Promise((res,rej) => {
        setTimeout(() => res(), 300)
      });
      expect(onTextHighlighted).to.have.property('callCount', 0);
      expect(wrapper.containsMatchingElement(<span>T</span>)).to.equal(true);
      expect(wrapper.containsMatchingElement(<span>e</span>)).to.equal(true);
      expect(wrapper.containsMatchingElement(<span>s</span>)).to.equal(true);
      expect(wrapper.containsMatchingElement(<span>t</span>)).to.equal(true);
    });
    it('should not call mouse event if mouse up on wrap component and rangeCount is 0 after 200ms delay', async () => {
      const onMouseOverHighlightedWord = sinon.spy();
      const onTextHighlighted = sinon.spy();
      const range: any[] = [];
      const text = <><p>Test text</p><p>Test Text 2</p></>;

      const wrapper = mount(
      <Highlightable
        ranges={range}
        enabled={true}
        onTextHighlighted={onTextHighlighted}
        id={'test'}
        onMouseOverHighlightedWord={onMouseOverHighlightedWord}
        rangeRenderer={(a, b) => b}
        highlightStyle={{
          backgroundColor: '#ffcc80',
          enabled: true
        }}
        text={text}/>
      );
      const wDiv = wrapper.find('div').get(0);
      const firstPNode = wrapper.find('p').first().getDOMNode();
      expect(!!wDiv).to.equal(true);
      // Add selection Object manually
      const selection = new SelectionImpl();
      selection.rangeCount = 0;
      const selectionRange = new RangeImpl();
      selectionRange.setStart(firstPNode, 0)
      selectionRange.setEnd(firstPNode, 5)
      selection.addRange(selectionRange)
      const anyGlobal: any = global;
      anyGlobal.window.getSelection = () => selection;
      wrapper.simulate("mouseup");
      await new Promise((res,rej) => {
        setTimeout(() => res(), 300)
      });
      expect(onTextHighlighted).to.have.property('callCount', 0);
      expect(wrapper.containsMatchingElement(<span>T</span>)).to.equal(true);
      expect(wrapper.containsMatchingElement(<span>e</span>)).to.equal(true);
      expect(wrapper.containsMatchingElement(<span>s</span>)).to.equal(true);
      expect(wrapper.containsMatchingElement(<span>t</span>)).to.equal(true);
    });
    it('should process on mouse move event appropriately (call only when mouse down and change range object if selection is valid)', async () => {
      const onMouseOverHighlightedWord = sinon.spy();
      const onTextHighlighted = sinon.spy();
      const range: any[] = [];
      const text = <><p>Test text</p><p>Test Text 2</p></>;

      const wrapper = mount(
      <Highlightable
        ranges={range}
        enabled={true}
        onTextHighlighted={onTextHighlighted}
        id={'test'}
        onMouseOverHighlightedWord={onMouseOverHighlightedWord}
        rangeRenderer={(a, b) => b}
        highlightStyle={{
          backgroundColor: '#ffcc80',
          enabled: true
        }}
        text={text}/>
      );
      const wDiv = wrapper.find('div').get(0);
      const firstPNode = wrapper.find('p').first().getDOMNode();
      expect(!!wDiv).to.equal(true);
      // Add selection Object manually
      const selection = new SelectionImpl();
      selection.rangeCount = 0;
      const selectionRange = new RangeImpl();
      selectionRange.setStart(firstPNode, 0)
      selectionRange.setEnd(firstPNode, 5)
      selection.addRange(selectionRange)
      const anyGlobal: any = global;
      anyGlobal.window.getSelection = () => selection;
      expect(!!(wrapper.instance() as any).range).to.equal(false);
      expect(!!(wrapper.instance() as any).mouseDown).to.equal(false);
      wrapper.simulate("mousedown");
      wrapper.simulate("mousemove");
      expect(!!(wrapper.instance() as any).range).to.equal(false);
      expect(!!(wrapper.instance() as any).mouseDown).to.equal(true);
      wrapper.simulate("mouseup");
      anyGlobal.window.getSelection = () => undefined;
      wrapper.simulate("mousedown");
      wrapper.simulate("mousemove");
      expect(!!(wrapper.instance() as any).range).to.equal(false);
      expect(!!(wrapper.instance() as any).mouseDown).to.equal(true);
      wrapper.simulate("mouseup");
      selection.rangeCount = 1;
      anyGlobal.window.getSelection = () => selection;
      wrapper.simulate("mousemove");
      expect(!!(wrapper.instance() as any).range).to.equal(false);
      expect(!!(wrapper.instance() as any).mouseDown).to.equal(false);
      wrapper.simulate("mousedown");
      wrapper.simulate("mousemove");
      expect(!!(wrapper.instance() as any).range).to.equal(true);
      expect(!!(wrapper.instance() as any).mouseDown).to.equal(true);
    });
    it('should process on mouse move down appropriately (set mouse down flag)', async () => {
      const onMouseOverHighlightedWord = sinon.spy();
      const onTextHighlighted = sinon.spy();
      const range: any[] = [];
      const text = <><p>Test text</p><p>Test Text 2</p></>;

      const wrapper = mount(
      <Highlightable
        ranges={range}
        enabled={true}
        onTextHighlighted={onTextHighlighted}
        id={'test'}
        onMouseOverHighlightedWord={onMouseOverHighlightedWord}
        rangeRenderer={(a, b) => b}
        highlightStyle={{
          backgroundColor: '#ffcc80',
          enabled: true
        }}
        text={text}/>
      );
      expect(!!(wrapper.instance() as any).mouseDown).to.equal(false);
      wrapper.simulate("mousedown");
      expect(!!(wrapper.instance() as any).mouseDown).to.equal(true);
      wrapper.simulate("mouseup");
      expect(!!(wrapper.instance() as any).mouseDown).to.equal(false);
      wrapper.simulate("mousedown");
      expect(!!(wrapper.instance() as any).mouseDown).to.equal(true);
    });
  });
});


describe('Test Highlightable component methods', function () {
  describe('processChildrenNodes method', function () {
    const onMouseOverHighlightedWord = sinon.spy();
    const onTextHighlighted = sinon.spy();
    const range: any[] = [];
    const text = <><p>Test text</p><p>Test Text 2</p></>;

    const wrapper = mount(<Highlightable
         ranges={range}
         enabled={true}
         onTextHighlighted={onTextHighlighted}
         id={'test'}
         onMouseOverHighlightedWord={onMouseOverHighlightedWord}
         rangeRenderer={(a, b) => b}
         highlightStyle={{
           backgroundColor: '#ffcc80',
           enabled: true
         }}
         text={text}
      />);
      const componentInstance = wrapper.instance() as any as HighlightableComponentModel;
    it('parent is a React.Component and current element is a text', () => {
        const highlightPart: HighlightPart = {
          parentElement: <div></div>,
          currentElement: "Test"
        };
        const processResult = componentInstance.processChildrenNodes(highlightPart, {
          startPoint:0,
          joinedText: ""
        });
        expect(processResult.textLength).to.equal(4);
        expect(Array.isArray(processResult.element)).to.equal(false);
        expect((processResult.element as React.ReactElement).props.children.length).to.equal(4);
        expect((processResult.element as React.ReactElement).props.children.map((child: any) => child.props.children).join("")).to.equal("Test");
    });
    it('parent and current element are React.Component', () => {
      const highlightPart: HighlightPart = {
        parentElement: <div></div>,
        currentElement: <span>Test</span>
      };
      const processResult = componentInstance.processChildrenNodes(highlightPart, {
        startPoint:0,
        joinedText: ""
      });
      expect(processResult.textLength).to.equal(4);
      expect(Array.isArray(processResult.element)).to.equal(false);
      expect((processResult.element as React.ReactElement).props.children.length).to.equal(1);
      expect((processResult.element as React.ReactElement).props.children[0].type).to.equal("span");
      const spanChild = (processResult.element as React.ReactElement).props.children[0];
      expect((spanChild as React.ReactElement).props.children.length).to.equal(4);
      expect((spanChild as React.ReactElement).props.children.map((child: any) => child.props.children).join("")).to.equal("Test");
  });
  it('parent is a React.Component and current element is a React.Component array ', () => {
    const highlightPart: HighlightPart = {
      parentElement: <div></div>,
      currentElement: [<span>Test</span>, <span>Test2</span>]
    };
    const processResult = componentInstance.processChildrenNodes(highlightPart, {
      startPoint:0,
      joinedText: ""
    });
    expect(processResult.textLength).to.equal(9);
    expect(Array.isArray(processResult.element)).to.equal(false);
    expect((processResult.element as React.ReactElement).props.children.length).to.equal(2);
    expect((processResult.element as React.ReactElement).props.children[0].type).to.equal("span");
    expect((processResult.element as React.ReactElement).props.children[1].type).to.equal("span");
    const spanChild1 = (processResult.element as React.ReactElement).props.children[0];
    const spanChild2 = (processResult.element as React.ReactElement).props.children[1];
    expect((spanChild1 as React.ReactElement).props.children.length).to.equal(4);
    expect((spanChild1 as React.ReactElement).props.children.map((child: any) => child.props.children).join("")).to.equal("Test");
    expect((spanChild2 as React.ReactElement).props.children.length).to.equal(5);
    expect((spanChild2 as React.ReactElement).props.children.map((child: any) => child.props.children).join("")).to.equal("Test2");
  });
  it('parent is a React.Component and current element is a complex React.Component with another React.Components as children ', () => {
    const highlightPart: HighlightPart = {
      parentElement: <div></div>,
      currentElement: <div><p><span>Test</span></p> <p><span>Test2</span></p></div>
    };
    const processResult = componentInstance.processChildrenNodes(highlightPart, {
      startPoint:0,
      joinedText: ""
    });
    expect(processResult.textLength).to.equal(10);
    expect(Array.isArray(processResult.element)).to.equal(false);
    expect((processResult.element as React.ReactElement).props.children.length).to.equal(1);
    expect((processResult.element as React.ReactElement).props.children[0].type).to.equal("div");
    const divChildWrapper = (processResult.element as React.ReactElement).props.children[0];
    expect((divChildWrapper as React.ReactElement).props.children.length).to.equal(3);
    expect((divChildWrapper as React.ReactElement).props.children[0].type).to.equal("p");
    expect(Array.isArray((divChildWrapper as React.ReactElement).props.children[1])).to.equal(true);
    expect((divChildWrapper as React.ReactElement).props.children[1][0].props.children).to.equal(" ");
    expect((divChildWrapper as React.ReactElement).props.children[2].type).to.equal("p");
    const pChild1 = (divChildWrapper as React.ReactElement).props.children[0];
    const pChild2 = (divChildWrapper as React.ReactElement).props.children[2];
    expect((pChild1 as React.ReactElement).props.children.length).to.equal(1);
    expect((pChild1 as React.ReactElement).props.children[0].type).to.equal("span");
    expect((pChild2 as React.ReactElement).props.children.length).to.equal(1);
    expect((pChild2 as React.ReactElement).props.children[0].type).to.equal("span");
    const spanChild1 = (pChild1 as React.ReactElement).props.children[0];
    const spanChild2 = (pChild2 as React.ReactElement).props.children[0];
    expect((spanChild1 as React.ReactElement).props.children.length).to.equal(4);
    expect((spanChild1 as React.ReactElement).props.children.map((child: any) => child.props.children).join("")).to.equal("Test");
    expect((spanChild2 as React.ReactElement).props.children.length).to.equal(5);
    expect((spanChild2 as React.ReactElement).props.children.map((child: any) => child.props.children).join("")).to.equal("Test2");
  });
  it('parent and current element are undefined', () => {
    const highlightPart = {
    } as any;
    expect(componentInstance.processChildrenNodes.bind(componentInstance, highlightPart, {
      startPoint:0,
      joinedText: ""
    })).to.throw("At least parent element should be passed to the processChildrenNodes function!");

  });
  it('parent is a React.Component and current element is undefined', () => {
    const highlightPart = {
      parentElement: <div></div>
    } as any;
    const processResult = componentInstance.processChildrenNodes(highlightPart, {
      startPoint: 0,
      joinedText: ""
    });
    expect(processResult.textLength).to.equal(0);
    expect((processResult.element as React.ReactElement).type).to.equal("div");
    expect(!!(processResult.element as React.ReactElement).props.children).to.equal(false);
  });
  });
  describe('getRanges method', function () {
    it('text prop is a text', () => {
      const onMouseOverHighlightedWord = sinon.spy();
      const onTextHighlighted = sinon.spy();
      const range: any[] = [];
      const text = "Test";
  
      const wrapper = mount(<Highlightable
          ranges={range}
          enabled={true}
          onTextHighlighted={onTextHighlighted}
          id={'test'}
          onMouseOverHighlightedWord={onMouseOverHighlightedWord}
          rangeRenderer={(a, b) => b}
          highlightStyle={{
            backgroundColor: '#ffcc80',
            enabled: true
          }}
          text={text}
        />);
        const componentInstance = wrapper.instance() as any as HighlightableComponentModel;
        const ranges = componentInstance.getRanges();
        expect(ranges.length).to.equal(1);
    });
    it('text prop is a React.Component', () => {
      const onMouseOverHighlightedWord = sinon.spy();
      const onTextHighlighted = sinon.spy();
      const range: any[] = [];
      const text = <><p>Test text</p><p>Test Text 2</p></>;
  
      const wrapper = mount(<Highlightable
          ranges={range}
          enabled={true}
          onTextHighlighted={onTextHighlighted}
          id={'test'}
          onMouseOverHighlightedWord={onMouseOverHighlightedWord}
          rangeRenderer={(a, b) => b}
          highlightStyle={{
            backgroundColor: '#ffcc80',
            enabled: true
          }}
          text={text}
        />);
        const componentInstance = wrapper.instance() as any as HighlightableComponentModel;
        const ranges = componentInstance.getRanges();
        expect(ranges.length).to.equal(1);
    });
    it('text prop is a React.Component array', () => {
      const onMouseOverHighlightedWord = sinon.spy();
      const onTextHighlighted = sinon.spy();
      const range: any[] = [];
      const text = [<p>Test text</p>, <p>Test Text 2</p>];
  
      const wrapper = mount(<Highlightable
          ranges={range}
          enabled={true}
          onTextHighlighted={onTextHighlighted}
          id={'test'}
          onMouseOverHighlightedWord={onMouseOverHighlightedWord}
          rangeRenderer={(a, b) => b}
          highlightStyle={{
            backgroundColor: '#ffcc80',
            enabled: true
          }}
          text={text}
        />);
        const componentInstance = wrapper.instance() as any as HighlightableComponentModel;
        const ranges = componentInstance.getRanges();
        expect(ranges.length).to.equal(2);
    });
  });
});

