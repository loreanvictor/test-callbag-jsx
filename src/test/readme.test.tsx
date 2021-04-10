/* eslint-disable no-unused-expressions */

import state from 'callbag-state'
import { should, expect } from 'chai'
import { RendererLike } from 'render-jsx'
import { ref } from 'render-jsx/common'

import { testRender } from '..'


should()

export function RemovableHellow({ name }: { name: string }, renderer: RendererLike<any>) {
  const div = ref()
  const typed = state('')

  return <div _ref={div}>
    <p>Hellow {name}:: {typed}!</p>
    <input type='text' _state={typed}/>
    <button onclick={() => renderer.remove(div.$)}>REMOVE</button>
  </div>
}

describe('RemovableHellow', () => {
  it('should say hellow and then be removed when clicked', () => {

    testRender((renderer, { render, $ }) => {
      render(<RemovableHellow name='Jack'/>)
      $('p').text()!.should.equal('Hellow Jack:: !')

      $('input').type('I just typed this')
      $('p').text()!.should.equal('Hellow Jack:: I just typed this!')

      $('button').click()
      expect($('p').resolveOne()).to.be.undefined
    })

  })
})
