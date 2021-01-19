import { should, expect } from 'chai';
import { JSDOM } from 'jsdom';

import { testGlobalRender, testRender } from '..';

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


describe('testGlobalRender', () => {
  it('should allow rendering on global window object.', () => {
    testGlobalRender((renderer, $) => {
      expect(window).to.not.be.undefined;
      expect(document).to.not.be.undefined;
      expect(localStorage).to.not.be.undefined;
      expect(window.matchMedia).to.not.be.undefined;

      renderer.render(<div>Hellow</div>).on(document.body);
      expect($('div').text()).to.equal('Hellow');
    });
  });

  it('should cleanup the global window object after sync tests are done.', () => {
    expect(() => window).to.throw();

    testGlobalRender(() => {
      expect(window).to.not.be.undefined;
    });

    expect(() => window).to.throw();
  });

  it('should provide cleanup callback to async tests.', done => {
    expect(() => window).to.throw();

    testGlobalRender((renderer, $, cleanup) => {
      renderer.render(<div onclick={() => {
        cleanup();
        expect(() => window).to.throw();
        done();
      }}>Click Me!</div>).on(document.body);

      $('div').click();
    });
  });
});
