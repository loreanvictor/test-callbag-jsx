import { DOMWindow } from 'jsdom'
import { Interactable } from './interactable'
import { safe } from './util'


export class Query extends Interactable {
  constructor(
    readonly q: string | undefined,
    readonly base: HTMLElement | Document,
    private dispatch: (e: HTMLElement, t: string, p?: any) => void,
  ) {
    super()
  }

  document(): Document {
    if (this.base.nodeType === this.base.DOCUMENT_NODE) {
      return this.base as Document
    } else {
      return this.base.ownerDocument!
    }
  }

  target() {
    return safe(this.resolveOne())
  }

  resolveOne() {
    if (!this.q) {
      return this.base as HTMLElement
    } else {
      return (this.base.querySelector(this.q) || undefined) as (HTMLElement | undefined)
    }
  }

  resolve() {
    if (!this.q) {
      return [this.base]
    } else {
      return Array.from(this.base.querySelectorAll(this.q)) as HTMLElement[]
    }
  }

  children(q = '*') {
    if (this.q) {
      return new Query(this.q + ' ' + q, this.base, this.dispatch)
    } else {
      return new Query(q, this.base, this.dispatch)
    }
  }

  first() {
    if (!this.q) {
      return this
    } else {
      return new Query(undefined, safe(this.resolveOne()), this.dispatch)
    }
  }

  nth(n: number) {
    if (!this.q) {
      return this
    } else {
      return new Query(undefined, safe(this.resolve()[n - 1]), this.dispatch)
    }
  }

  nthFromLast(n: number) {
    if (!this.q) {
      return this
    } else {
      const L = this.resolve()

      return new Query(undefined, safe(L[L.length - n - 1]), this.dispatch)
    }
  }

  second() { return this.nth(2) }
  last() { return this.nthFromLast(0) }

  parent() {
    const p = this.resolveOne()?.parentElement
    if (p) {
      return new Query(undefined, p, this.dispatch)
    } else {
      return this
    }
  }

  text() {
    return this.resolveOne()?.textContent || undefined
  }

  html() {
    return this.resolveOne()?.innerHTML || undefined
  }

  attr(key: string) {
    return this.resolveOne()?.getAttribute(key) || undefined
  }

  is(cls: string) {
    return this.resolveOne()?.classList.contains(cls) || false
  }

  trigger(e: string, p?: any) {
    this.dispatch(safe(this.resolveOne()), e, p)
  }
}

export type QueryFn = (q?: string | HTMLElement | Document) => Query;

export function makeQueryFn(dom: DOMWindow) {
  const dispatch = (e: HTMLElement, t: string, p?: any) => e.dispatchEvent(new dom.Event(t, p))

  return (q?: string | HTMLElement | Document) => {
    if (typeof q === 'string') {
      return new Query(q, dom.document, dispatch)
    } else {
      return new Query(undefined, q || dom.document, dispatch)
    }
  }
}
