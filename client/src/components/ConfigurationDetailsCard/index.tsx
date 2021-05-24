import useSWR from 'swr'
import CircularProgress from '@material-ui/core/CircularProgress'
import CardContainer from '../CardContainer'
import CardHeader from '../CardHeader'
import CardStatusTable from '../CardStatusTable'
import Button from '../Button'
import { DTO_PipelineConfigurationStatus } from '../../../../DTO/pipeline'

type ConfigurationDetailsCardProps = {
	id: string
}

const ConfigurationDetailsCard = (props: ConfigurationDetailsCardProps) => {
	const { id } = props
	const { data } = useSWR<DTO_PipelineConfigurationStatus>(
		`/api/pipeline/${id}/config/status`
	)

	return (
		<CardContainer>
			<CardHeader
				status={!data ? 'gray' : data.status === 'VALID' ? 'green' : 'red'}
				title='Configuration'
				buttons={() => (
					<Button variant='outlined' disabled={!data}>
						Edit config
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
							head: 'Last updated:',
							data: (
								<>
									{data.status === 'VALID'
										? new Date(data.date).toLocaleString()
										: '-'}
								</>
							)
						}
					]}
					headWidth='110px'
				/>
			)}
		</CardContainer>
	)
}

export default ConfigurationDetailsCard
