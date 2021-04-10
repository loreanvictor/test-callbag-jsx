import event from '@testing-library/user-event'
import { mapMatchingOptions } from './util'


export abstract class Interactable {
  abstract document(): Document
  abstract target(): HTMLElement

  click() {
    return event.click(this.target())
  }

  dblclick() {
    return event.dblClick(this.target())
  }

  type(text: string, delay = 0) {
    return event.type(this.target(), text, { delay })
  }

  clear() {
    return event.clear(this.target())
  }

  select(...values: any[]) {
    const target = this.target()

    return event.selectOptions(target, mapMatchingOptions(target, values) as any)
  }

  deselect(...values: any[]) {
    const target = this.target()

    return event.deselectOptions(target, mapMatchingOptions(target, values) as any)
  }

  tab(direction: 1 | -1 = 1) {
    let focusTrap = this.target()
    if (focusTrap.nodeType === focusTrap.DOCUMENT_NODE) {
      focusTrap = (focusTrap as any as Document).body
    }

    return event.tab({ focusTrap, shift: direction === -1 })
  }

  hover() {
    return event.hover(this.target())
  }

  unhover() {
    return event.unhover(this.target())
  }

  paste(text: string) {
    return event.paste(this.target() as any, text)
  }

  upload(...files: File[]) {
    return event.upload(this.target() as any, files)
  }
}
