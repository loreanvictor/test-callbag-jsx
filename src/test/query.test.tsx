/* eslint-disable no-unused-expressions */
import state from 'callbag-state'
import delay from 'delay'
import { pipe, debounce } from 'callbag-common'
import { should, expect } from 'chai'
import { testRender } from '..'


should()

describe('query function ($)', () => {
  it('should allow querying children with given query function.', done => {
    testRender((renderer, { render, $ }) => {
      render(<>
        <div/>
        <div class='A'>
          <div/>
          <div class='B' onclick={() => done()}/>
          <div/>
        </div>
      </>)

      $('.A').children('.B').click()
    })
  })

  it('should allow querying last element of a query set.', () => {
    testRender((renderer, { render, $ }) => {
      render(<>
        <p>Hellow</p>
        <p>World</p>
        <p>!</p>
      </>)

      expect($('p').last().text()).to.equal('!')
    })
  })

  it('should allow querying parent elements.', done => {
    testRender((renderer, { render, $ }) => {
      render(<>
        <div><p/></div>
        <div onclick={() => done()}><p/></div>
      </>)

      $('p').last().parent().click()
    })
  })

  describe('.click()', () => {
    it('should emulate clicking on elements.', () => {
      testRender((renderer, { render, $ }) => {
        let r = 0
        let d = 0
        let u = 0

        render(<div
          onclick={() => r++}
          onmouseup={() => u++}
          onmousedown={() => d++}>Click ME!</div>
        )

        $('div').click()
        r.should.equal(1)
        d.should.equal(1)
        u.should.equal(1)
      })
    })
  })

  describe('.dblclick()', () => {
    it('should emulate double clicking on elements.', () => {
      testRender((renderer, { render, $ }) => {
        let r = 0
        let d = 0
        let u = 0

        render(<div
          onclick={() => r++}
          onmouseup={() => u++}
          onmousedown={() => d++}>Click ME!</div>
        )

        $('div').dblclick()
        r.should.equal(2)
        d.should.equal(2)
        u.should.equal(2)
      })
    })
  })

  describe('.hover() & .unhover()', () => {
    it('should emulate hovering elements.', () => {
      testRender((renderer, { $, render }) => {
        let i = 0
        let o = 0

        render(<div
          onmouseenter={() => i++}
          onmouseleave={() => o++}
        />)

        $('div').hover()
        i.should.equal(1)
        o.should.equal(0)
        $('div').unhover()
        o.should.equal(1)
      })
    })
  })

  describe('.type()', () => {
    it('should emulate typing into inputs.', () => {
      testRender((renderer, { render, $ }) => {
        const s = state('')
        let u = 0
        let d = 0

        render(<input
          onkeydown={() => d++}
          onkeyup={() => u++}
          type='text' _state={s}
        />)

        $('input').type('hellow')
        s.get().should.equal('hellow')
        u.should.equal(6)
        d.should.equal(6)
      })
    })

    it('should support delays between key presses.', done => {
      testRender(async (renderer, { render, $ }) => {
        const s = state('')
        const t = pipe(s, debounce(3))

        render(<>
          <input type='text' _state={s}/>
          <p>{t}</p>
        </>)

        await $('input').type('yo', 1)

        s.get().should.equal('yo')
        expect($('p').text()).to.be.undefined

        await delay(3)

        $('p').text()!.should.equal('yo')
        done()
      })
    })
  })

  describe('.select() & .deselect()', () => {
    it('should emulate selecting/deselecting options.', () => {
      testRender((renderer, { $, render }) => {
        const s = state(undefined)
        const v = {x : 2}

        render(<select _state={s} multiple>
          <option>A</option>
          <option value='bb'>B</option>
          <option _value={v}>C</option>
        </select>)

        $('select').select('A')
        expect(s.get()).to.eql(['A'])

        $('select').select('B', v)
        expect(s.get()).to.eql(['A', 'bb', {x: 2}])

        $('select').deselect('bb')
        expect(s.get()).to.eql(['A', {x: 2}])
      })
    })
  })

  describe('.tab()', () => {
    it('should emulate switching focus using tab.', () => {
      testRender((renderer, { render, press, $, tab }) => {
        const s1 = state('')
        const s2 = state('')

        render(<>
          <div>
            <input type='text' _state={s1}/>
            <input type='text' _state={s2}/>
          </div>
          <input type='text'/>
        </>)

        press('hey there')
        $('div').tab()
        press('hellow')
        $('div').tab()
        press('world')
        $('div').tab()
        press('!')
        tab(); tab()
        press('xyz')

        s1.get().should.equal('hellow!')
        s2.get().should.equal('world')
      })
    })

    it('should also accept a direction -1 to go backwards.', () => {
      testRender((renderer, { render, $, press }) => {
        const s1 = state('')
        const s2 = state('')
        const s3 = state('')

        render(<>
          <div>
            <input type='text' _state={s1}/>
            <input type='text' _state={s2}/>
            <input type='text' _state={s3}/>
          </div>
          <input type='text'/>
        </>)

        $('div').tab()
        press('hellow')
        $('div').tab()
        press('world')
        $('div').tab()
        press('hola')
        $('div').tab()
        press('!')
        $('div').tab(-1)
        press('!!')

        s1.get().should.equal('hellow!')
        s2.get().should.equal('world')
        s3.get().should.equal('hola!!')
      })
    })
  })

  describe('.clear()', () => {
    it('should clear an input text.', () => {
      testRender((renderer, { render, $ }) => {
        const s = state('')
        render(<textarea _state={s}/>)

        $('textarea').type('hellow')
        s.get().should.equal('hellow')
        $('textarea').clear()
        s.get().should.equal('')
      })
    })
  })

  describe('.paste()', () => {
    it('should paste stuff into given input.', () => {
      testRender((renderer, { render, $ }) => {
        const s = state('')
        let k = 0

        render(<input type='text' _state={s} onkeydown={() => k++}/>)

        $('input').paste('hellow world!')
        s.get().should.equal('hellow world!')
        k.should.equal(0)

        $('input').type('{backspace}')
        k.should.equal(1)
        s.get().should.equal('hellow world')
      })
    })
  })
})
