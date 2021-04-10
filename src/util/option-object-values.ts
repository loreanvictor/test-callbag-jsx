// TODO: update render-jsx to export this, change this to use render-jsx/dom/util
function getOptionObjectValue($: HTMLOptionElement) {
  return ($ as any)._value
}

function matchingOption(
  value: any,
  options: HTMLOptionElement[]
) {
  return options.find(op => getOptionObjectValue(op) === value)
}

export function mapMatchingOptions(select: HTMLElement, values: any[]) {
  const options = Array.from(select.querySelectorAll('option'))

  return values
    .map(
      value => {
        if (typeof value === 'string') {
          return value
        } else {
          return matchingOption(value, options)
        }
      }
    )
    .filter(_ => !!_) as (HTMLElement | string)[]
}
