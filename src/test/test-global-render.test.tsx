
/* eslint-disable no-unused-expressions */
import { should, expect } from 'chai'
import { testGlobalRender } from '..'


should()

describe('testGlobalRender()', () => {
  it('should allow rendering on global window object.', () => {
    testGlobalRender((renderer, { $ }) => {
      expect(window).to.not.be.undefined
      expect(document).to.not.be.undefined
      expect(localStorage).to.not.be.undefined
      expect(window.matchMedia).to.not.be.undefined

      renderer.render(<div>Hellow</div>).on(document.body)
      expect($('div').text()).to.equal('Hellow')
    })
  })

  it('should cleanup the global window object after sync tests are done.', () => {
    expect(() => window).to.throw()

    testGlobalRender(() => {
      expect(window).to.not.be.undefined
    })

    expect(() => window).to.throw()
  })

  it('should provide cleanup callback to async tests.', done => {
    expect(() => window).to.throw()

    testGlobalRender((renderer, { render, $ }, cleanup) => {
      render(<div onclick={() => {
        cleanup()
        expect(() => window).to.throw()
        done()
      }}>Click Me!</div>)

      $('div').click()
    })
  })
})
