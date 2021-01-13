import { should } from 'chai';
import { JSDOM } from 'jsdom';

import { testRender } from '..';

should();

describe('testRender()', () => {
  it('should render given stuff and provide ability to mock click stuff.', done => {
    testRender((renderer, document, extras) => {
      renderer.render(<button onclick={() => done()}/>).on(document.body);
      extras.click(document.body.firstElementChild as HTMLElement);
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
