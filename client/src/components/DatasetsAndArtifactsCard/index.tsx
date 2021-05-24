import useSWR from 'swr'
import CircularProgress from '@material-ui/core/CircularProgress'
import CardContainer from '../CardContainer'
import CardHeader from '../CardHeader'
import CardStatusTable from '../CardStatusTable'
import Button from '../Button'
import { DTO_PipelineDatasetsAndArtifactsStatus } from '../../../../DTO/pipeline'

type DatasetsAndArtifactsCardProps = {
	id: string
}

const DatasetsAndArtifactsCard = (props: DatasetsAndArtifactsCardProps) => {
	const { id } = props
	const { data } = useSWR<DTO_PipelineDatasetsAndArtifactsStatus>(
		`/api/pipeline/${id}/dataset-and-artifacts/status`
	)

	const getDatasetsAndArtifactsStatusColor = (status: boolean) => {
		switch (status) {
			case true:
				return 'green'
			case false:
				return 'red'
			default:
				return 'gray'
		}
	}

	return (
		<CardContainer>
			<CardHeader
				status={
					!data ? 'gray' : getDatasetsAndArtifactsStatusColor(data.deployed)
				}
				title='Datasets / Artifacts'
				buttons={() => (
					<Button variant='outlined' disabled={!data}>
						upload dataset
					</Button>
				)}
			/>
			{!data ? (
				<>
					<CircularProgress />
				</>
			) : (
				<CardStatusTable
					table={[
						{
							head: 'Status:',
							data: <>{data.deployed ? 'Deployed' : 'Not deployed'}</>
						},
						{
							head: 'Endpoint:',
							data: <>{data.endpoint.length > 0 ? data.endpoint : '-'}</>
						}
					]}
					headWidth='80px'
				/>
			)}
		</CardContainer>
	)
}

export default DatasetsAndArtifactsCard
