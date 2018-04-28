import React from 'react'
import ReactDOM from 'react-dom'

import App from './App'

/**
 * The <Root> component is a functional React component that is responsible for being the root
 * React component/element that gets rendered (mounted) into the DOM. It shouldn't contain any logic
 * and minimally just renders another component that is the topmost component for our app (in this
 * case <App>).
 */
const Root = () => <App />

// Use 'ReactDOM.render()' instead of 'ReactDOM.hydrate()' as we aren't doing any SSR/weren't
// rendered with 'ReactDOMServer.renderToString()'
ReactDOM.render(<Root />, document.getElementById('root'))
