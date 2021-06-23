import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import Box from '@material-ui/core/Box'
import PipelinesPage from './pages/pipelines'
import PipelineDetailsPage from './pages/pipeline-details'
import './App.css'

function App() {
	return (
		<Box component='main' p={'24px'} height={'-webkit-fill-available'}>
			test
			<Router>
				<Switch>
					<Route path='/pipeline/:pipeline/run/:run'>
						pipeline run details
					</Route>
					<Route path='/pipeline/:pipeline'>
						<PipelineDetailsPage />
					</Route>
					<Route path='/'>
						<PipelinesPage />
					</Route>
				</Switch>
			</Router>
		</Box>
	)
}

export default App
