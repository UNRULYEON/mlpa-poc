import React, { useEffect } from 'react'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import Box from '@material-ui/core/Box'
import PipelinesPage from './pages/pipelines'
import './App.css'
import { useSetRecoilState } from 'recoil'

function App() {
	return (
		<Box component='main' p={'24px'} height={'-webkit-fill-available'}>
			<Router>
				<Switch>
					<Route path='/pipeline/:pipeline/run/:run'>
						pipeline run details
					</Route>
					<Route path='/pipeline/:pipeline'>pipeline details</Route>
					<Route path='/'>
						<PipelinesPage />
					</Route>
				</Switch>
			</Router>
		</Box>
	)
}

export default App
