import { should } from 'chai';
import { testRender } from '..';


describe('testRender()', () => {
  it('should render given stuff and provide ability to mock click stuff.', done => {
    testRender((renderer, document, extras) => {
      renderer.render(<button onclick={() => done()}/>).on(document.body);
      extras.click(document.body.firstElementChild as HTMLElement);
    });
  });
});
