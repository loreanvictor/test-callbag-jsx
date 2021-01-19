import register from 'jsdom-global';
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

type SyncGlobalTestFn = (renderer: LiveDOMRenderer, $: QueryFn) => void;
type AsyncGlobalTestFn = (renderer: LiveDOMRenderer, $: QueryFn, cleanup: () => void) => void;

function isSync(fn: SyncGlobalTestFn | AsyncGlobalTestFn): fn is SyncGlobalTestFn {
  return fn.length < 3;
}

export function testGlobalRender(test: AsyncGlobalTestFn): void;
export function testGlobalRender(test: SyncGlobalTestFn): void;
export function testGlobalRender(
  test: SyncGlobalTestFn | AsyncGlobalTestFn
) {
  const cleanup = register();
  require('localstorage-polyfill');
  require('matchmedia-polyfill');
  require('matchmedia-polyfill/matchMedia.addListener');
  testRender((renderer, _, $) => {
    if (isSync(test)) {
      test(renderer, $);
      cleanup();
    } else {
      test(renderer, $, cleanup);
    }
  }, window as any);
}
