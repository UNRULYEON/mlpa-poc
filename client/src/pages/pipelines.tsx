import { useState } from 'react'
import { Pipeline } from '@prisma/client'
import { useHistory } from 'react-router-dom'
import useSWR, { mutate } from 'swr'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import TextField from '@material-ui/core/TextField'
import InputLabel from '@material-ui/core/InputLabel'
import MenuItem from '@material-ui/core/MenuItem'
import Grid from '@material-ui/core/Grid'
import FormControl from '@material-ui/core/FormControl'
import Select from '@material-ui/core/Select'
import { useSnackbar } from 'notistack'
import Header from '../components/Header'
import Button from '../components/Button'
import Dialog from '../components/Dialog'
import CardContainer from '../components/CardContainer'
import { DTO_CreatePipeline, Platform } from '../../../DTO/pipeline'

const initialNewPipeline: DTO_CreatePipeline = {
	name: '',
	project: '',
	project_id: '',
	platform: 'AZURE'
}

const PipelinesPage = () => {
	let history = useHistory()
	const { enqueueSnackbar } = useSnackbar()
	const [createPipelineDialog, setCreatePipelineDialog] =
		useState<boolean>(false)
	const [newPipeline, setNewPipeline] =
		useState<DTO_CreatePipeline>(initialNewPipeline)
	const [creatingPipeline, setCreatingPipeline] = useState<boolean>(false)
	const { data, error } = useSWR<Pipeline[]>('/api/pipelines')

	const handlePlatformChange = (
		event: React.ChangeEvent<{ value: unknown }>
	) => {
		setNewPipeline({ ...newPipeline, platform: event.target.value as Platform })
	}

	const resetCreatePipelineDialog = () => setNewPipeline(initialNewPipeline)

	const createNewPipeline = () => {
		setCreatingPipeline(true)
		fetch('/api/pipeline', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(newPipeline)
		})
			.then(r => {
				if (r.ok) {
					mutate('/api/pipelines')
					enqueueSnackbar('Created pipeline', {
						variant: 'success'
					})
					setCreatePipelineDialog(false)
				} else {
					enqueueSnackbar('There was a problem creating a new pipeline', {
						variant: 'error'
					})
				}
			})
			.finally(() => setCreatingPipeline(false))
	}

	if (!data) {
		return <span id='pipelines-loading'>loading...</span>
	}

	return (
		<>
			<Header
				title='Pipelines'
				buttons={() => (
					<Button
						onClick={() => setCreatePipelineDialog(true)}
						disabled={creatingPipeline}
					>
						Create pipeline
					</Button>
				)}
			/>
			<Dialog
				fullWidth
				maxWidth='xs'
				open={createPipelineDialog}
				close={() => setCreatePipelineDialog(false)}
				onExited={() => resetCreatePipelineDialog()}
				title='Create a new pipeline'
				buttons={() => (
					<Button
						onClick={() => createNewPipeline()}
						disabled={creatingPipeline}
					>
						Create
					</Button>
				)}
			>
				<Grid container direction='column' spacing={3}>
					<Grid item>
						<TextField
							required
							label='Name'
							variant='outlined'
							autoComplete='off'
							fullWidth
							autoFocus
							disabled={creatingPipeline}
							value={newPipeline.name}
							onChange={e =>
								setNewPipeline({ ...newPipeline, name: e.target.value })
							}
						/>
					</Grid>
					<Grid item>
						<TextField
							required
							label='Project name'
							variant='outlined'
							autoComplete='off'
							fullWidth
							disabled={creatingPipeline}
							value={newPipeline.project}
							onChange={e =>
								setNewPipeline({ ...newPipeline, project: e.target.value })
							}
						/>
					</Grid>
					<Grid item>
						{' '}
						<FormControl required variant='outlined' fullWidth>
							<InputLabel id='platform-select-label'>Platform</InputLabel>
							<Select
								labelId='platform-select-label'
								id='platform-select'
								value={newPipeline.platform}
								onChange={handlePlatformChange}
								label='Platform'
								disabled={creatingPipeline}
							>
								<MenuItem value={'AZURE'}>Microsoft Azure</MenuItem>
								<MenuItem value={'GOOGLE'}>Google Cloud</MenuItem>
							</Select>
						</FormControl>
					</Grid>
					{newPipeline.platform === 'GOOGLE' && (
						<Grid item>
							<TextField
								required
								label='Project ID'
								variant='outlined'
								autoComplete='off'
								fullWidth
								disabled={creatingPipeline}
								value={newPipeline.project_id}
								onChange={e =>
									setNewPipeline({ ...newPipeline, project_id: e.target.value })
								}
							/>
						</Grid>
					)}
				</Grid>
			</Dialog>
			<CardContainer px={0} id='pipeline-card'>
				{error ? (
					<span id='pipelines-error'>
						There was a problem retrieving the data. Please try again.
					</span>
				) : !data ? (
					<span id='pipelines-loading'>Loading pipelines...</span>
				) : (
					<Table aria-label='simple table' id='pipeline-table'>
						<TableHead>
							<TableRow>
								<TableCell>Name</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{data.length <= 0 ? (
								<TableRow>
									<TableCell component='th' scope='Name' id='no-pipelines'>
										There are no pipeline. Create a new one.
									</TableCell>
								</TableRow>
							) : (
								<>
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
								</>
							)}
						</TableBody>
					</Table>
				)}
			</CardContainer>
		</>
	)
}

export default PipelinesPage
