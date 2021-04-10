<div align="center">

<img src="https://raw.githubusercontent.com/loreanvictor/callbag-jsx/main/docs/assets/callbag.svg" width="128px"/>
<br/>

# emulating user interactions

</div>

The query helper (`$` parameter passed to `testRender()` and `testGlobalRender()` handlers)
partially wraps [`@testing-library/user-event`](https://github.com/testing-library/user-event)
to provide convenient methods for emulating user interaction:

```tsx
testRender((renderer, { render, $, tab, press }) => {
  const s = state('')
  render(<>
    <input _state={s} type='text'/>
    <button onclick={() => s.set('')}>Clear</button>
  </>)

  tab()                  // 👉 press <tab> key to focus an input
  press('hellow there')  // 👉 press this key sequence
  s.get().should.equal('hellow there')

  $('button').click()    // 👉 clear the input
  $('input').resolveOne()!.value.should.equal('')
})
```

<br>

> For convenience, methods on `$` have limited customizability.
> For more customized interaction emulation you can use [`@testing-library/user-event`](https://github.com/testing-library/user-event)
> directly.

<br>

👉 `.click()` emulates a click:
```ts
$(someElement).click()
$('button').last().click()
```

👉 `.dblclick()` emulates a double click:
```ts
$(someElement).dblclick()
```

These methods also trigger hover events.

<br>

👉 `.hover()` emulates a mouse enter event:
```ts
$(someElement).hover()
```
👉 `.unhover()` emulates a mouse exit event:
```ts
$(someElement).unhover()
```

<br>

👉 `.type()` writes given text inside an `<input>` or `<textarea>`:
```ts
$('input#id').type('hellow')
```

You can also provide a delay, which will cause a delay between each keypress:

```ts
await spec.textarea().type('Hey there!', 200)
```

`.type()` will also click the element beforehand.

👉 `.type()` also supports [special characters](https://github.com/testing-library/user-event#special-characters):

```ts
$('textarea').type('hellow! {backspace} world')
```

<br>

👉 `.clear()` clears value of an input:

```ts
$('input').clear()
```

This method selects the text inside the element and deletes it.

<br>

👉 `.paste()` pastes some value into input:

```ts
$('input').paste('hellow there!')
```

Note that `.paste()` does not trigger keyboard events.

<br>

👉 `.select()` selects a given option of a select element:

```tsx
const Jack = { name: 'Jack' }

render(<select>
  <option>A</option>
  <option value='B'>Choose B</option>
  <option value={Jack}>Choose Jack</option>
</select>)

$('select').select('A')     // 👉 pick option by option label
$('select').select('B')     // 👉 pick option by option value
$('select').select(Jack)    // 👉 pick option via object value
```

For multi-selects, you can provide multiple options to `.select()`:

```ts
$('select').select('A', Jack)
```

You can also use `.deselect()` to deselect option(s):

```ts
$('select').deselect(Jack, 'B')
```

<br>

👉 `.upload()` will emulate uploading files into an input:

```ts
const fileA = new File(['hellow'], 'hellow.png', {type: 'image/png'})
const fileB = new File(['goodbye'], 'goodbye.png', {type: 'image/png'})

$('input').upload(fileA, fileB)
```

<br>

👉 `.tab()` will rotate focus through children of the element:

```tsx
render(<>
  <div class='A'>
    <input type='text' class='A1'/>
    <button class='A2'/>
  </div>
  <input class='B'/>
</>)

$('.A').tab()     // 👉 input.A1 is focused
$('.A').tab()     // 👉 button.A2 is focused
$('.A').tab()     // 👉 input.A1 is focused again
$('.A').tab(-1)   // 👉 goes back, so button.A2 is focused

// 👉 input.B is never focused
```

👉 Call `.tab(-1)` to emulating `Shift + Tab`.

<br><br>

# Global Interactions

Additional methods are provided to `testRender()` and `testGlobalRender()` handlers for emulating
global events (global tab press, global keyboard press):

```tsx
testRender((renderer, { render, $, tab, press }) => {
  const s = state('')
  render(<>
    <input _state={s} type='text'/>
    <button onclick={() => s.set('')}>Clear</button>
  </>)

  tab()                  // 👉 press <tab> key to focus an input
  press('hellow there')  // 👉 press this key sequence
  s.get().should.equal('hellow there')

  $('button').click()    // 👉 clear the input
  $('input').resolveOne()!.value.should.equal('')
})
```

👉 Call `tab(-1)` to emulating `Shift + Tab`.

👉 `press()` supports the same [special characters](https://github.com/testing-library/user-event#special-characters) as `.type()`.

<br><br>
