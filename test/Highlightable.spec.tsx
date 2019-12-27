import 'jsdom-global/register';
import sinon from 'sinon';
import React from 'react';
import { expect } from 'chai';
import Enzyme, { mount, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import Highlightable, { HightlightRange } from '../src';
import { SelectionImpl, RangeImpl } from './utils';

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
        setTimeout(() => res(), 200)
      });
      expect(onTextHighlighted).to.have.property('callCount', 1);
      expect(wrapper.containsMatchingElement(<span>T</span>)).to.equal(true);
      expect(wrapper.containsMatchingElement(<span>e</span>)).to.equal(true);
      expect(wrapper.containsMatchingElement(<span>s</span>)).to.equal(true);
      expect(wrapper.containsMatchingElement(<span>t</span>)).to.equal(true);
    });
  });
});

