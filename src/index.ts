import { DOMWindow, JSDOM } from 'jsdom';
import { LiveDOMRenderer } from 'render-jsx/dom';
import { makeRenderer } from 'callbag-jsx';

import { makeQueryFn, QueryFn } from './query';


export function testRender(
  test: (renderer: LiveDOMRenderer, document: Document, $: QueryFn, window: DOMWindow) => void,
  provided?: DOMWindow,
) {
  const dom = provided || (new JSDOM().window);
  const renderer = makeRenderer(dom);

  test(
    renderer,
    dom.document,
    makeQueryFn(dom),
    dom
  );
}
