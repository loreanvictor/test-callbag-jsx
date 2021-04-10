import register from 'jsdom-global'
import event from '@testing-library/user-event'
import { DOMWindow, JSDOM } from 'jsdom'
import { LiveDOMRenderer } from 'render-jsx/dom'
import { makeRenderer } from 'callbag-jsx'

import { makeQueryFn } from './query'
import { makeRenderFn, RenderFn, SpecUtils } from './spec'


export interface TestingUtils extends SpecUtils {
  render: RenderFn
  press: (stroke: string, delay?: number) => void
  tab: (direction?: 1 | -1) => void
}

export type LocalTestFn = (renderer: LiveDOMRenderer, utils: TestingUtils) => void | Promise<void>

export function testRender(
  test: LocalTestFn,
  provided?: DOMWindow,
) {
  const dom = provided || (new JSDOM().window)
  const renderer = makeRenderer(dom)
  const $ = makeQueryFn(dom)

  const specUtils = {
    document: dom.document,
    window: dom as any as Window,
    $,
    press: (stroke: string, delay = 0) => event.keyboard(stroke, { document: dom.document, delay }),
    tab: (direction: 1 | -1 = 1) => $().tab(direction),
  }

  const p = test(
    renderer,
    {
      ...specUtils,
      render: makeRenderFn(renderer, specUtils),
    }
  )

  if (p instanceof Promise) {
    p.catch(console.log)
  }
}

type SyncGlobalTestFn = (renderer: LiveDOMRenderer, utils: TestingUtils) => void
type AsyncGlobalTestFn = (renderer: LiveDOMRenderer, utils: TestingUtils, cleanup: () => void) => void

function isSync(fn: SyncGlobalTestFn | AsyncGlobalTestFn): fn is SyncGlobalTestFn {
  return fn.length < 3
}

export function testGlobalRender(test: AsyncGlobalTestFn): void;
export function testGlobalRender(test: SyncGlobalTestFn): void;
export function testGlobalRender(
  test: SyncGlobalTestFn | AsyncGlobalTestFn
) {
  const cleanup = register()
  require('localstorage-polyfill')
  require('matchmedia-polyfill')
  require('matchmedia-polyfill/matchMedia.addListener')
  testRender((renderer, utils) => {
    if (isSync(test)) {
      test(renderer, utils)
      cleanup()
    } else {
      test(renderer, utils, cleanup)
    }
  }, window as any)
}

