import { should, expect } from 'chai';
import { JSDOM } from 'jsdom';
import { ref } from 'render-jsx/common';
import { LiveDOMRenderer } from 'render-jsx/dom';

import { testGlobalRender, testRender } from '..';
import { Query } from '../query';
import { SpecUtils, VisualSpecFn } from '../spec';

should();

describe('testRender()', () => {
  it('should render given stuff and provide ability to mock click stuff.', done => {
    testRender((renderer, { render, $ }) => {
      render(<button onclick={() => done()}/>);
      $('body :first-child').click();
    });
  });

  it('should render given stuff and provide ability to mock event dispatching.', done => {
    testRender((renderer, { render, $ }) => {
      render(<button onmouseup={() => done()}/>);
      $('button').trigger('mouseup');
    });
  });

  it('should allow querying children with given query function.', done => {
    testRender((renderer, { render, $ }) => {
      render(<>
        <div/>
        <div class='A'>
          <div/>
          <div class='B' onclick={() => done()}/>
          <div/>
        </div>
      </>);

      $('.A').children('.B').click();
    });
  });

  it('should allow querying last element of a query set.', () => {
    testRender((renderer, { render, $ }) => {
      render(<>
        <p>Hellow</p>
        <p>World</p>
        <p>!</p>
      </>);

      expect($('p').last().text()).to.equal('!');
    });
  });

  it('should allow querying parent elemens.', done => {
    testRender((renderer, { render, $ }) => {
      render(<>
        <div><p/></div>
        <div onclick={() => done()}><p/></div>
      </>);

      $('p').last().parent().click();
    });
  });

  it('should render using given jsdom instance.', () => {
    const jsdom = new JSDOM();
    testRender((renderer, { render }) => {
      render(<div>Hellow</div>);
      jsdom.window!.document!.body!.textContent!.should.equal('Hellow');
    }, jsdom.window);
  });
});

describe('utils.render(node, spec)', () => {
  it('should allow mapping component tree semantically.', () => {
    const Comp = (props: {name: string}, renderer: LiveDOMRenderer) => {
      const r = ref();
  
      return <>
        <div _ref={r}>Hellow {props.name}</div>
        <button onclick={() => renderer.remove(r.$)}>DEL</button>
      </>
    }

    const Spec = (root: Query) => ({
      name: () => root.children('div'),
      btn: () => root.children('button'),
    });

    testRender((renderer, { render }) => {
      const spec = render(<Comp name='Jack'/>, Spec);
      expect(spec.name().text()).to.equal('Hellow Jack');
      spec.btn().click();
      expect(spec.name().text()).to.be.undefined;
    });
  });
});

describe('testGlobalRender()', () => {
  it('should allow rendering on global window object.', () => {
    testGlobalRender((renderer, { $ }) => {
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

    testGlobalRender((renderer, { render, $ }, cleanup) => {
      render(<div onclick={() => {
        cleanup();
        expect(() => window).to.throw();
        done();
      }}>Click Me!</div>);

      $('div').click();
    });
  });
});
