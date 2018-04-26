import React from 'react'
import ReactDOM from 'react-dom'

const Root = () => 'LOL Bananas are silly'

// Use 'ReactDOM.render()' instead of 'ReactDOM.hydrate()' as we aren't doing any SSR/weren't
// rendered with 'ReactDOMServer.renderToString()'
ReactDOM.render(<Root />, document.getElementById('root'))
