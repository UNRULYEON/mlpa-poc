import useSWR from 'swr'
import CircularProgress from '@material-ui/core/CircularProgress'
import CardContainer from '../CardContainer'
import CardHeader from '../CardHeader'
import CardStatusTable from '../CardStatusTable'
import Button from '../Button'
import {
	DTO_PipelineStatus,
	PipelineStatus,
	Platform
} from '../../../../DTO/pipeline'

type PipelineDetailsCardProps = {
	id: string
}

const PipelineDetailsCard = (props: PipelineDetailsCardProps) => {
	const { id } = props
	const { data } = useSWR<DTO_PipelineStatus>(`/api/pipeline/${id}/status`)

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

	return (
		<CardContainer>
			<CardHeader
				status={!data ? 'gray' : getPipelineStatusColor(data.status)}
				title='Pipeline'
				buttons={() => (
					<Button variant='outlined' disabled>
						Start
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
							data: (
								<>
									{data.status.charAt(0) + data.status.slice(1).toLowerCase()}
								</>
							)
						},
						{
							head: 'Last run:',
							data: <>{data.Run.length > 0 ? 'there is a run' : 'No runs'}</>
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
