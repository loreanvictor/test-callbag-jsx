/* eslint-disable no-unused-expressions */
import state from 'callbag-state'
import { should, expect } from 'chai'
import { JSDOM } from 'jsdom'
import { ref } from 'render-jsx/common'
import { LiveDOMRenderer } from 'render-jsx/dom'

import { testRender } from '..'
import { Query } from '../query'


should()

describe('testRender()', () => {
  it('should render given stuff and provide ability to mock click stuff.', done => {
    testRender((renderer, { render, $ }) => {
      render(<button onclick={() => done()}/>)
      $('body :first-child').click()
    })
  })

  it('should render given stuff and provide ability to mock event dispatching.', done => {
    testRender((renderer, { render, $ }) => {
      render(<button onmouseup={() => done()}/>)
      $('button').trigger('mouseup')
    })
  })

  it('should render using given jsdom instance.', () => {
    const jsdom = new JSDOM()
    testRender((renderer, { render }) => {
      render(<div>Hellow</div>)
      jsdom.window!.document!.body!.textContent!.should.equal('Hellow')
    }, jsdom.window)
  })

  it('should provide a utility for emulating keypress.', done => {
    testRender((renderer, { render, $, press }) => {
      const s1 = state('')
      const s2 = state('')

      render(<>
        <input type='text' _state={s1}/>
        <input type='text' _state={s2}/>
      </>)

      press('hey there')
      $('input').first().click()
      press('hellow')
      $('input').second().click()
      press('world')

      s1.get().should.equal('hellow')
      s2.get().should.equal('world')

      done()
    })
  })

  it('should provide a utility for emulating focus switch with tab key.', done => {
    testRender((renderer, { render, press, tab }) => {
      const s1 = state('')
      const s2 = state('')

      render(<>
        <input type='text' _state={s1}/>
        <input type='text' _state={s2}/>
      </>)

      press('hey there')
      tab()
      press('hellow')
      tab()
      press('world')

      s1.get().should.equal('hellow')
      s2.get().should.equal('world')

      done()
    })
  })
})

describe('utils.render(node, spec)', () => {
  it('should allow mapping component tree semantically.', () => {
    const Comp = (props: {name: string}, renderer: LiveDOMRenderer) => {
      const r = ref()

      return <>
        <div _ref={r}>Hellow {props.name}</div>
        <button onclick={() => renderer.remove(r.$)}>DEL</button>
      </>
    }

    const Spec = (root: Query) => ({
      name: () => root.children('div'),
      btn: () => root.children('button'),
    })

    testRender((renderer, { render }) => {
      const spec = render(<Comp name='Jack'/>, Spec)
      expect(spec.name().text()).to.equal('Hellow Jack')
      spec.btn().click()
      expect(spec.name().text()).to.be.undefined
    })
  })
})
