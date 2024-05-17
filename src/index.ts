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

type AsyncLocalTestFn = (renderer: LiveDOMRenderer, utils: TestingUtils) => Promise<void>
type SyncLocalTestFn = (renderer: LiveDOMRenderer, utils: TestingUtils) => void
export type LocalTestFn = SyncLocalTestFn | AsyncLocalTestFn

export function testRender(test: SyncLocalTestFn, provided?: DOMWindow): void
export function testRender(test: AsyncLocalTestFn, provided?: DOMWindow): Promise<void>
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

  return test(
    renderer,
    {
      ...specUtils,
      render: makeRenderFn(renderer, specUtils),
    }
  )

}

type SyncGlobalTestFn = (renderer: LiveDOMRenderer, utils: TestingUtils) => void
type AsyncGlobalTestFn = (renderer: LiveDOMRenderer, utils: TestingUtils, cleanup: () => void) => void

function isSync(fn: SyncGlobalTestFn | AsyncGlobalTestFn): fn is SyncGlobalTestFn {
  return fn.length < 3
}

export function testGlobalRender(test: AsyncGlobalTestFn): Promise<void>
export function testGlobalRender(test: SyncGlobalTestFn): void
export function testGlobalRender(
  test: SyncGlobalTestFn | AsyncGlobalTestFn
): void | Promise<void> {
  const cleanup = register()
  require('localstorage-polyfill')
  require('matchmedia-polyfill')
  require('matchmedia-polyfill/matchMedia.addListener')
  testRender((renderer, utils) => {
    if (isSync(test)) {
      test(renderer, utils)
      cleanup()
    } else {
      return new Promise<void>((resolve) => {
        test(renderer, utils, () => {
          cleanup()
          resolve()
        })
      })
    }
  }, window as any)
}

