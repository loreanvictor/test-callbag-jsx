<div align="center">

<img src="https://raw.githubusercontent.com/loreanvictor/callbag-jsx/main/docs/assets/callbag.svg" width="128px"/>
<br/>

# usage

</div>

<br>

```bash
npm i test-callbag-jsx --save-dev
```

<br>

test-callbag-jsx uses [jsdom](https://github.com/jsdom/jsdom) to created isolated DOM and renderer instances for each test. It also provides a
query utility (like a mini-[jQuery](https://jquery.com)) for easier traversal and interaction with DOM:

```tsx
import { testRender } from 'test-callbag-jsx'

//
// You can use whatever test-runner and assertion library you would like.
// For these examples I have used mocha and chai.
//
describe('my component', () => {
  it('should have some desired behaviors ...', done => {
  
    //
    // testRender() provides an isolated renderer and document instances.
    // $ is the query function attached to this isolated document.
    //
    testRender((renderer, document, $) => {
    
      renderer.render(
        <MyComp onclick={() => done()}>
          Hellow There!
        </MyComp>
      ).on(document.body)
      
      //
      // test whether content is renderered properly.
      //
      $('body :first-child').text().should.equal('Hellow There!')
      
      //
      // test whether click interaction works.
      //
      $('body :first-child').click()
      
      //
      // 👉 Note that `document` is only defined in this scope and is not registered globally.
      //
    })
  
    //
    // 👉 So here `document` is `undefined`.
    //
  })
})
```

<br><br>

# Global Objects

Sometimes your code will access global `window`, `document`, `localStorage`, etc objects, which are not accessible by default in testing environment.
For testing such code, use `testGlobalRender()` instead of `testRender()`, as it registers these global variables and polyfills them when necessary.

```ts
import { testGlobalRender } from 'test-callbag-jsx'


describe('whatever ...', () => {
  it('should do stuff ...', () => {
  
    //
    // testGlobalRender() does not provide a document object,
    // as you can use the global document object.
    //
    testGlobalRender((renderer, $) => {
    
      renderer.render(<MyComponent/>).on(document.body)
      
      $('body').text().should.equal('This is my commponent.')
      
    })
  
    //
    // 👉 note that the global document (and window, etc) variables are still isolated per test,
    //    so for example here `document` is still undefined.
    //
  })
})
```

By default, test-callbag-jsx will cleanup the global window and document instances after the test is run. In case of asynchronous tests, you
need to accept the cleanup callback and call it when the test is done:

```tsx
import { testGlobalRender } from 'test-callbag-jsx'


describe('whatever ...', () => {
  it('should do stuff ...', done => {
  
    //
    // the `cleanup` argument here will indicate that our test is async
    // and that we will cleanup the global variables after the test ourselves.
    //
    testGlobalRender((renderer, $, cleanup) => {
      renderer.render(
        <MyComponent onclick={() => {
          $('body').text().should.equal('Clicked!')
          
          //
          // remember to cleanup after testing is done
          //
          cleanup()
          done()
        }}/>
      ).on(document.body)
      
      $('body :first-child').click()
    })
  })
})
```

<br><br>

# Query Function Reference

The `$` parameter passed to test functions can be used to quickly traverse the DOM or interact with it. Note that it is also scoped
and bound to the specific DOM instance passed to the test and cannot be shared amongst test functions.

<br>

## Creation:

You can call `$` with a css selector:
```tsx
$('.my-class ul>li:last-child')
```

Or you can pass elements directly to it:
```tsx
const myElement = <MyComponent />
$(myElement).click()
```

<br>

## Traversal:

All traversal methods (described below) return a similar query object and can be chained together.

👉 `children()` returns a query selecting children (descendants) of parent query:

```ts
$('div').children()                  // --> this is all elements that are in a `div`
$('p').children('li')                // --> all `li`s that are in a `p`
$(myElement).children('[readonly]')  // --> all readonly elements inside `myElement`
```

<br>

👉 `first()` returns a query selecting the first element matching parent query:

```ts
$('div').first()                    // --> first `div`

//
// Notice that the following are NOT the same:
//
$('div').children('p').first()      // --> this selects first `p` inside a `div`
$('div').children('p:first-child')  // --> this selects all `p`s who are first child in their parent and are in a `div`
```

👉 You can similarly use `last()`, `second()`, `nth()` and `nthFromLast()`:

```ts
$('div').last()         // --> last `div` element
$('div').second()       // --> second `div` element (`nth(2) === second()`)
$('div').nth(3)         // --> 3rd `div` element (`nth(1) === first()`)
$('div').nthFromLast(3) // --> 3rd `div` from last (`nthFromLast(0) === last()`)
```

<br>

👉 `parent()` returns a query selecting the parent element:

```ts
$(myComp).parent().children('div').last().click()
```

<br>

## Properties:

These methods will return the corresponding property of the first element matching the query.

👉 `text()` returns text content of first element matching the query:
```ts
$('div').child('span').last().text().should.equal('Best Regards!')
```

<br>

👉 `html()` returns (inner) html content of the first element matching the query:
```ts
$(myElement).html().should.equal('<p>Hi There!</p>')
```

<br>

👉 `attr()` returns a specific attribute of the first element matching the query:
```ts
$(myElement).children('input').second().attr('disabled').should.be.true
```

<br>

👉 `is()` returns true when first element matching the query has given class:
```ts
$(myElement).is('some-class')
```

<br><br>

## Interaction:

These methods will trigger DOM events on the first element matching the query.

👉 `click()` triggers a click on first element matching the query:
```ts
$(myComp).children('button').last().click()
```

<br>

👉 `trigger(event, props?)` triggers given event (with given properties):
```ts
$('div').trigger('mouseup')
```

<br>

## Resolution:

👉 `resolve()` returns an array of all elements matching the query:

```ts
$(myComp).children('[attr=value]').resolve().length.should.equal(5)
```

<br>

👉 `resolveOne()` returns the first element matching the query.

<br><br>
