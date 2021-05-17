import React from 'react'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import './App.css'

function App() {
	return (
		<Router>
			<Switch>
				<Route path='/pipeline/:pipeline/run/:run'>pipeline run details</Route>
				<Route path='/pipeline/:pipeline'>pipeline details</Route>
				<Route path='/'>pipelines</Route>
			</Switch>
		</Router>
	)
}

export default App
