import { useState } from 'react'
import { Pipeline } from '@prisma/client'
import { useHistory } from 'react-router-dom'
import useSWR from 'swr'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import Header from '../components/Header'
import Button from '../components/Button'
import Dialog from '../components/Dialog'
import CardContainer from '../components/CardContainer'

const PipelinesPage = () => {
	let history = useHistory()
	const [createDialog, setCreateDialog] = useState<boolean>(false)
	const { data, error } = useSWR<Pipeline[]>('/api/pipelines')

	return (
		<>
			<Header
				title='Pipelines'
				buttons={() => (
					<Button onClick={() => setCreateDialog(true)}>Create pipeline</Button>
				)}
			/>
			<Dialog
				open={createDialog}
				close={() => setCreateDialog(false)}
				title='Create a new pipeline'
				buttons={() => <Button>Create</Button>}
			></Dialog>
			<CardContainer px={0}>
				{error ? (
					<>err</>
				) : !data ? (
					<>loading</>
				) : (
					<Table aria-label='simple table'>
						<TableHead>
							<TableRow>
								<TableCell>Name</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{data.map((pipeline, key) => (
								<TableRow
									hover
									onClick={() => history.push(`/pipeline/${pipeline.id}`)}
									style={{ cursor: 'pointer' }}
									key={`${key}-${pipeline.name}`}
								>
									<TableCell component='th' scope='Name'>
										{pipeline.name}
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				)}
			</CardContainer>
		</>
	)
}

export default PipelinesPage
