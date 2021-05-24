import useSWR from 'swr'
import { useHistory } from 'react-router-dom'
import CardContainer from '../CardContainer'
import CardHeader from '../CardHeader'
import Box from '@material-ui/core/Box'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import { Runs } from '../../../../DTO/run'

type RunsCardProps = {
	id: string
}

const RunsCard = (props: RunsCardProps) => {
	let history = useHistory()
	const { id } = props
	const { data, error } = useSWR<Runs>(`/api/pipeline/${id}/runs`)

	const getRunStatusColor = (status: 'RUNNING' | 'SUCCESS' | 'FAILED') => {
		switch (status) {
			case 'RUNNING':
				return 'orange'
			case 'SUCCESS':
				return 'green'
			case 'FAILED':
				return 'red'
			default:
				return 'gray'
		}
	}

	return (
		<CardContainer px={0}>
			<Box px={2}>
				<CardHeader title='Runs' />
			</Box>
			{error ? (
				<>err</>
			) : !data ? (
				<>loading</>
			) : (
				<Table aria-label='simple table'>
					<TableHead>
						<TableRow>
							<TableCell width={10}>Status</TableCell>
							<TableCell>Name</TableCell>
							<TableCell>Date</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{data.length <= 0 ? (
							<TableRow>
								<TableCell component='th' colSpan={3}>
									There are no runs. Start the pipeline to create a run.
								</TableCell>
							</TableRow>
						) : (
							<>
								{data.map((run, key) => (
									<TableRow
										hover
										onClick={() =>
											history.push(`/pipeline/${id}/run/${run.id}`)
										}
										style={{ cursor: 'pointer' }}
										key={`${key}-${run.name}`}
									>
										<TableCell component='th' scope='Status'>
											<Box
												width='15px'
												height='15px'
												bgcolor={getRunStatusColor(run.status)}
												borderRadius='50%'
												display='inline-block'
												mr='12px'
											/>
										</TableCell>
										<TableCell component='th' scope='Name'>
											{run.name}
										</TableCell>
										<TableCell component='th' scope='Date'>
											{new Date(run.date).toLocaleString()}
										</TableCell>
									</TableRow>
								))}
							</>
						)}
					</TableBody>
				</Table>
			)}
		</CardContainer>
	)
}

export default RunsCard
