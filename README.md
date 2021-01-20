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
👉 Provides an isolated document and renderer for testing around \
👉 Provides a function for clicking around to test interactions

P.S. this tool is pretty young. I will be adding further testing features (like controlling HTML inputs,
etc) based on request or need.

## Usage

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

    testRender((renderer, document, $) => {
      renderer.render(<RemovableHellow name='Jack'/>).on(document.body)
      $('body').text().should.equal('Hellow Jack!')

      $('body :first-child').click()
      $(body).text().should.equal('')
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

