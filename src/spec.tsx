import { LiveDOMRenderer } from 'render-jsx/dom'
import { Query, QueryFn } from './query'


export interface SpecUtils {
  document: Document
  window: Window
  $: QueryFn
}

export interface VisualSpec {
  [name: string]: () => Query
}

export type VisualSpecFn<V extends VisualSpec> = (root: Query, utils: SpecUtils) => V

export type RenderFn = {
  (node: Node): void
  <V extends VisualSpec>(node: Node, spec: VisualSpecFn<V>): V
}

export function makeRenderFn(renderer: LiveDOMRenderer, utils: SpecUtils): RenderFn {
  return <V extends VisualSpec>(node: Node, spec?: VisualSpecFn<V>) => {
    if (spec) {
      const container = <div/>
      renderer.render(container).on(utils.document.body)
      renderer.render(node).on(container)

      return spec(utils.$(container), utils)
    } else {
      renderer.render(node).on(utils.document.body)
    }
  }
}
