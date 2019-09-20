# react-wrap-request

A react-hook implementation for the [wrap-request](https://github.com/misantronic/wrap-request).

## basic usage

```jsx
function Component() {
  const { $: items } = useWrapRequest(
    () => fetch(`https://.../`), 
    { 
      defaultData: [], 
      deps: [] // fetch will happen when component did mount
    }
  )
  
  return <div>{items.map(item => item.id)}</div>;
}
```

## working with deps

```jsx
function Component(props) {
  const { $: items } = useWrapRequest(
    id => fetch(`https://.../${id}`), 
    { 
      defaultData: [], 
      deps: [props.id] // whenever props.id update, wrapRequest will re-fetch
    }
  )
  
  return <div>{items.map(item => item.id)}</div>;
}
```

## manual request

```jsx
function Component(props) {
  const wrapRequest = useWrapRequest(
    id => fetch(`https://.../${id}`), 
    { defaultData: [] }
  )
  
  useEffect(() => {
    wrapRequest.request(100);
  }, [])
  
  return <div>{wrapRequest.items.map(item => item.id)}</div>;
}
```

## pattern matching

```jsx
function Component(props) {
  const wrapRequest = useWrapRequest(
    id => fetch(`https://.../${id}`), 
    { 
      defaultData: [], 
      deps: [props.id]
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
