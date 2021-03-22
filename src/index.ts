import register from 'jsdom-global';
import { DOMWindow, JSDOM } from 'jsdom';
import { LiveDOMRenderer } from 'render-jsx/dom';
import { makeRenderer } from 'callbag-jsx';

import { makeQueryFn } from './query';
import { makeRenderFn, RenderFn, SpecUtils } from './spec';


export interface TestingUtils extends SpecUtils {
  render: RenderFn;
}

export type LocalTestFn = (renderer: LiveDOMRenderer, utils: TestingUtils) => void;

export function testRender(
  test: LocalTestFn,
  provided?: DOMWindow,
) {
  const dom = provided || (new JSDOM().window);
  const renderer = makeRenderer(dom);

  const specUtils = {
    document: dom.document,
    window: dom as any as Window,
    $: makeQueryFn(dom),
  };

  test(
    renderer,
    {
      ...specUtils,
      render: makeRenderFn(renderer, specUtils),
    }
  );
}

type SyncGlobalTestFn = (renderer: LiveDOMRenderer, utils: TestingUtils) => void;
type AsyncGlobalTestFn = (renderer: LiveDOMRenderer, utils: TestingUtils, cleanup: () => void) => void;

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
  testRender((renderer, utils) => {
    if (isSync(test)) {
      test(renderer, utils);
      cleanup();
    } else {
      test(renderer, utils, cleanup);
    }
  }, window as any);
}
