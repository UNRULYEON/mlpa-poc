import { useParams } from 'react-router'
import useSWR from 'swr'
import Grid from '@material-ui/core/Grid'
import Button from '@material-ui/core/Button'
import Header from '../components/Header'
import { DTO_PipelineDetails } from '../../../DTO/pipeline'
import PipelineDetailsCard from '../components/PipelineDetailsCard'
import ConfigurationDetailsCard from '../components/ConfigurationDetailsCard'
import RunsCard from '../components/RunsCard'
import DatasetsAndArtifactsCard from '../components/DatasetsAndArtifactsCard'

const PipelineDetailsPage = () => {
	const { pipeline } = useParams<{ pipeline: string }>()
	const { data, error } = useSWR<DTO_PipelineDetails>(
		`/api/pipeline/${pipeline}`
	)

	return (
		<>
			{error ? (
				<>err</>
			) : !data ? (
				<>loading</>
			) : (
				<>
					<Header backUrl='/' title={data.name} subtitle={data.project} />
					<Grid container spacing={3}>
						<Grid item xs={8}>
							<Grid container direction='row' spacing={3}>
								<Grid item xs>
									<PipelineDetailsCard id={pipeline} />
								</Grid>
								<Grid item xs>
									<ConfigurationDetailsCard id={pipeline} />
								</Grid>
							</Grid>
							<Grid container spacing={3}>
								<Grid item xs>
									<RunsCard />
								</Grid>
							</Grid>
						</Grid>
						<Grid item xs={4}>
							<DatasetsAndArtifactsCard />
						</Grid>
					</Grid>
				</>
			)}
		</>
	)
}

export default PipelineDetailsPage
