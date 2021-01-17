import { should, expect } from 'chai';
import { JSDOM } from 'jsdom';

import { testRender } from '..';

should();

describe('testRender()', () => {
  it('should render given stuff and provide ability to mock click stuff.', done => {
    testRender((renderer, document, $) => {
      renderer.render(<button onclick={() => done()}/>).on(document.body);
      $('body :first-child').click();
    });
  });

  it('should render given stuff and provide ability to mock event dispatching.', done => {
    testRender((renderer, document, $) => {
      renderer.render(<button onmouseup={() => done()}/>).on(document.body);
      $('button').trigger('mouseup');
    });
  });

  it('should allow querying children with given query function.', done => {
    testRender((renderer, document, $) => {
      renderer.render(<>
        <div/>
        <div class='A'>
          <div/>
          <div class='B' onclick={() => done()}/>
          <div/>
        </div>
      </>).on(document.body);

      $('.A').children('.B').click();
    });
  });

  it('should allow querying last element of a query set.', () => {
    testRender((renderer, document, $) => {
      renderer.render(<>
        <p>Hellow</p>
        <p>World</p>
        <p>!</p>
      </>).on(document.body);

      expect($('p').last().text()).to.equal('!');
    });
  });

  it('should allow querying parent elemens.', done => {
    testRender((renderer, document, $) => {
      renderer.render(<>
        <div><p/></div>
        <div onclick={() => done()}><p/></div>
      </>).on(document.body);

      $('p').last().parent().click();
    });
  });

  it('should render using given jsdom instance.', () => {
    const jsdom = new JSDOM();
    testRender((renderer, document) => {
      renderer.render(<div>Hellow</div>).on(document.body);
      jsdom.window!.document!.body!.textContent!.should.equal('Hellow');
    }, jsdom.window);
  });
});
