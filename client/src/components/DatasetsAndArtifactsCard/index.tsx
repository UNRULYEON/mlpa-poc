import useSWR from 'swr'
import CardContainer from '../CardContainer'
import CardHeader from '../CardHeader'
import CardStatusTable from '../CardStatusTable'
import Button from '../Button'
import { DTO_PipelineConfigurationStatus } from '../../../../DTO/pipeline'

const DatasetsAndArtifactsCard = () => {
	return (
		<CardContainer>
			<CardHeader
				status='gray'
				title='Datasets / Artifacts'
				buttons={() => <Button variant='outlined'>upload dataset</Button>}
			/>
			<CardStatusTable
				table={[
					{ head: 'Status:', data: <></> },
					{
						head: 'Endpoint:',
						data: <></>
					}
				]}
				headWidth='80px'
			/>
		</CardContainer>
	)
}

export default DatasetsAndArtifactsCard
