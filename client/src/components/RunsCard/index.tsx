import useSWR from 'swr'
import CardContainer from '../CardContainer'
import CardHeader from '../CardHeader'
import CardStatusTable from '../CardStatusTable'
import Button from '../Button'
import { DTO_PipelineConfigurationStatus } from '../../../../DTO/pipeline'

const RunsCard = () => {
	return (
		<CardContainer>
			<CardHeader title='Runs' />
		</CardContainer>
	)
}

export default RunsCard
