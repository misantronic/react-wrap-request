# react-wrap-request

A react-hook implementation for the [wrap-request](https://github.com/misantronic/wrap-request).

## usage

```jsx
function Component(props) {
  const wrapRequest = useWrapRequest(
    () => fetch('https://...'), 
    { 
      defaultData: [], 
      deps: [props.id] // whenever props.id update, wrapRequest will re-fetch
    }
  )
  
  return wrapRequest.match({
    loading: () => <div>Loading</div>,
    error: () => <div>Error</div>,
    empty: () => <div>No items.</div>,
    fetched: items => (
      <div>{items.map(item => item.id)}</div>
    )
  });
}
```
