import { DOMWindow, JSDOM } from 'jsdom';
import { LiveDOMRenderer } from 'render-jsx/dom';
import { makeRenderer } from 'callbag-jsx';


export interface Extras {
  window: DOMWindow;
  click: (element: HTMLElement) => void;
}

export function testRender(
  test: (renderer: LiveDOMRenderer, document: Document, extras: Extras) => void,
  provided?: JSDOM,
) {
  const dom = (provided || new JSDOM()).window;
  const renderer = makeRenderer(dom);

  test(renderer, dom.document, {
    window: dom,
    click: el => {
      const e = new dom.Event('click');
      el.dispatchEvent(e);
    }
  });
}
