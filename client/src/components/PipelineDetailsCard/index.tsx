import useSWR, { mutate } from 'swr'
import CircularProgress from '@material-ui/core/CircularProgress'
import CardContainer from '../CardContainer'
import CardHeader from '../CardHeader'
import CardStatusTable from '../CardStatusTable'
import Button from '../Button'
import {
	DTO_PipelineStatus,
	PipelineStatus,
	Platform,
	DTO_PipelineConfigurationStatus
} from '../../../../DTO/pipeline'

type PipelineDetailsCardProps = {
	id: string
}

const PipelineDetailsCard = (props: PipelineDetailsCardProps) => {
	const { id } = props
	const { data } = useSWR<DTO_PipelineStatus>(`/api/pipeline/${id}/status`)
	const { data: configStatus } = useSWR<DTO_PipelineConfigurationStatus>(
		`/api/pipeline/${id}/config/status`
	)

	const getPipelineStatusColor = (status: PipelineStatus) => {
		switch (status) {
			case 'ERROR':
				return 'red'
			case 'IDLE':
				return 'orange'
			case 'RUNNING':
				return 'green'
			default:
				return 'gray'
		}
	}

	const getPipelinePlatformText = (platform: Platform) => {
		switch (platform) {
			case 'AZURE':
				return 'Azure'
			case 'GOOGLE':
				return 'Google Cloud'
			default:
				return platform
		}
	}

	const startPipeline = () => {
		fetch(`/api/pipeline/${id}/start`).then(r => {
			if (r.ok) {
				mutate(`/api/pipeline/${id}/status`)
			}
		})
	}

	return (
		<CardContainer id='pipeline-details-card'>
			<CardHeader
				status={!data ? 'gray' : getPipelineStatusColor(data.status)}
				title='Pipeline'
				buttons={() => (
					<>
						{configStatus && (
							<Button
								variant='outlined'
								onClick={() => startPipeline()}
								disabled={configStatus.status === 'INVALID'}
							>
								Start
							</Button>
						)}
					</>
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
							data: (
								<>
									{data.status.charAt(0) + data.status.slice(1).toLowerCase()}
								</>
							)
						},
						{
							head: 'Platform:',
							data: <>{getPipelinePlatformText(data.platform)}</>
						}
					]}
					headWidth='80px'
				/>
			)}
		</CardContainer>
	)
}

export default PipelineDetailsCard
