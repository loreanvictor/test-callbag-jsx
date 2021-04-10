<div align="center">

<img src="https://raw.githubusercontent.com/loreanvictor/callbag-jsx/main/docs/assets/callbag.svg" width="128px"/>
<br/>

# test-callbag-jsx

[![tests](https://img.shields.io/github/workflow/status/loreanvictor/test-callbag-jsx/Run%20Tests?label=tests&logo=mocha&logoColor=green&style=flat-square)](https://github.com/loreanvictor/test-callbag-jsx/actions?query=workflow%3A%22Run+Tests%22)
[![version](https://img.shields.io/npm/v/test-callbag-jsx?logo=npm&style=flat-square)](https://www.npmjs.com/package/test-callbag-jsx)

</div>

<br/><br/>

A simple utility for testing callbag-jsx code.

```bash
npm i --save-dev test-callbag-jsx
```

👉 Testing-framework agnostic \
👉 Isolated document and renderer for testing \
👉 Emulate user interaction (using [@testing-library/user-event](https://github.com/testing-library/user-event))


## Usage

```tsx
// removable-hellow.tsx

import state from 'callbag-state'
import { ref } from 'render-jsx/common'


export function RemovableHellow({ name }, renderer) {
  const div = ref()
  const typed = state('')

  return <div _ref={div}>
    <p>Hellow {name}:: {typed}!</p>
    <input type='text' _state={typed}/>
    <button onclick={() => renderer.remove(div.$)}>REMOVE</button>
  </div>
}
```
```tsx
// removable-hellow.test.tsx

import { testRender } from 'test-callbag-jsx'

import { should } from 'chai'
import { RemovableHellow } from './removable-hellow'

should()

describe('RemovableHellow', () => {
  it('should say hellow and then be removed when clicked', () => {

    testRender((renderer, { render, $ }) => {
      render(<RemovableHellow name='Jack'/>)
      $('p').text().should.equal('Hellow Jack:: !')

      $('input').type('I just typed this')
      $('p').text().should.equal('Hellow Jack:: I just typed this!')

      $('button').click()
      expect($('p').exists()).to.be.false
    })

  })
})
```

<br>

👉 [Read the Docs](/usage.md)

<br><br>

## Contribution

Be nice and respectful. Useful commands for development:

```bash
git clone https://github.com/loreanvictor/test-callbag-jsx.git
```
```bash
npm i             # --> install dependencies
```
```bash
npm test          # --> run tests
```

