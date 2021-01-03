<div align="center">

<img src="https://raw.githubusercontent.com/loreanvictor/callbag-jsx/main/docs/assets/callbag.svg" width="128px"/>
<br/>

# test-callbag-jsx

[![tests](https://img.shields.io/github/workflow/status/loreanvictor/test-callbag-jsx/Run%20Tests?label=tests&logo=mocha&logoColor=green&style=flat-square)](https://github.com/loreanvictor/test-callbag-jsx/actions?query=workflow%3A%22Run+Tests%22)
[![version](https://img.shields.io/npm/v/test-callbag-jsx?logo=npm&style=flat-square)](https://www.npmjs.com/package/test-callbag-jsx)

</div>

A simple utility for testing callbag-jsx code.

```bash
npm i --save-dev test-callbag-jsx
```

👉 Testing-framework agnostic \
👉 Provides an isolated document and renderer for testing around \
👉 Provides a function for clicking around to test interactions

P.S. this tool is pretty young. I will be adding further testing features (like controlling HTML inputs,
etc) based on request or need.

## Usage

```tsx
// hellow.tsx

export function Hellow({ name }, renderer) {
  return <div>Hellow {name}!</div>
}
```
```tsx
// hellow.test.tsx

import { testRender } from 'test-callbag-jsx'
import { should } from 'chai'

import { Hellow } from './hellow'

should()

describe('Hellow', () => {
  it('should say hellow', () => {
    testRender((renderer, document) => {
      renderer.render(<Hellow name='World'/>).on(document.body)
      document.body.textContent.should.equal('Hellow World!')
    })
  })
})
```

Another example:

```tsx
// removable-hellow.tsx

import { ref } from 'render-jsx/common'

export function RemovableHellow({ name }, renderer) {
  const div = ref()

  return <div _ref={div} onclick={() => renderer.remove(div)}>
    Hellow {name}!
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
    testRender((renderer, document, extras) => {
      renderer.render(<RemovableHellow name='Jack'/>).on(document.body)
      document.body.textContent.should.equal('Hellow Jack!')

      extras.click(document.body.firstChild)
      document.body.textContent.should.equal('')
    })
  })
})
```
