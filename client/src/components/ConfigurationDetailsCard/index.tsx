import React, { useEffect, useState } from 'react'
import useSWR, { mutate } from 'swr'
import CircularProgress from '@material-ui/core/CircularProgress'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import Box from '@material-ui/core/Box'
import DialogTitle from '@material-ui/core/DialogTitle'
import TableContainer from '@material-ui/core/TableContainer'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import Paper from '@material-ui/core/Paper'
import Editor from '@monaco-editor/react'
import { useSnackbar } from 'notistack'
import CardContainer from '../CardContainer'
import CardHeader from '../CardHeader'
import CardStatusTable from '../CardStatusTable'
import Button from '../Button'
import { DTO_PipelineConfigurationStatus } from '../../../../DTO/pipeline'
import { DTO_PipelineConfiguration } from '../../../../DTO/configuration'
import { DTO_PipelineDatasetsAndArtifactsFile } from '../../../../DTO/datasets-and-artifacts'
import { convertBytes } from '../../utils'

type ConfigurationDetailsCardProps = {
	id: string
}

const ConfigurationDetailsCard = (props: ConfigurationDetailsCardProps) => {
	const { id } = props
	const { enqueueSnackbar } = useSnackbar()
	const { data } = useSWR<DTO_PipelineConfigurationStatus>(
		`/api/pipeline/${id}/config/status`
	)
	const { data: pipelineConfig } = useSWR<DTO_PipelineConfiguration>(
		`/api/pipeline/${id}/configuration`
	)
	const { data: data_files, error: error_files } = useSWR<
		DTO_PipelineDatasetsAndArtifactsFile[]
	>(`/api/pipeline/${id}/dataset-and-artifacts/files`)
	const [configDialogOpen, setConfigDialogOpen] = useState<boolean>(false)
	const [config, setConfig] = useState<string>('')
	const [savingConfig, setSavingConfig] = useState<boolean>(false)

	const handleCloseConfigDialog = () => setConfigDialogOpen(false)

	useEffect(() => {
		if (pipelineConfig) {
			setConfig(pipelineConfig.config)
		}
	}, [pipelineConfig])

	const saveConfig = () => {
		setSavingConfig(true)
		fetch(`/api/pipeline/${id}/configuration`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ config: config })
		})
			.then(r => {
				if (r.ok) {
					mutate(`/api/pipeline/${id}/config/status`)
					mutate(`/api/pipeline/${id}/status`)
					enqueueSnackbar('Configuration saved', {
						variant: 'success'
					})
					setConfigDialogOpen(false)
				} else {
					enqueueSnackbar('There was a problem saving the configuration', {
						variant: 'error'
					})
				}
			})
			.finally(() => {
				setConfigDialogOpen(false)
				setSavingConfig(false)
			})
	}

	return (
		<>
			<CardContainer>
				<CardHeader
					status={!data ? 'gray' : data.status === 'VALID' ? 'green' : 'red'}
					title='Configuration'
					buttons={() => (
						<Button
							variant='outlined'
							disabled={!data}
							onClick={() => setConfigDialogOpen(true)}
						>
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
			<Dialog
				fullWidth
				maxWidth='lg'
				open={configDialogOpen}
				onClose={handleCloseConfigDialog}
				aria-labelledby='config-editor-dialog-title'
				aria-describedby='config-editor-dialog-description'
			>
				<DialogTitle id='config-editor-dialog-title'>
					Edit configuration
				</DialogTitle>
				<DialogContent style={{ overflowY: 'hidden' }}>
					<Box borderRadius='20px' border='1px' display='flex'>
						{pipelineConfig && (
							<Editor
								height='80vh'
								defaultLanguage='python'
								theme='vs-dark'
								className='test'
								value={config}
								options={{ wordWrap: 'on' }}
								onChange={value => setConfig(value || '')}
							/>
						)}
						<Box minWidth={300} ml={3}>
							{error_files ? (
								<>error fetching files</>
							) : !data_files ? (
								<>loading</>
							) : (
								<>
									<Box
										fontWeight='bold'
										textAlign='center'
										fontSize={22}
										mb={2}
									>
										Click to copy the URL
									</Box>
									<TableContainer component={Paper}>
										<Table aria-label='simple table'>
											<TableHead>
												<TableRow>
													<TableCell>Name</TableCell>
													<TableCell width={90}>Size</TableCell>
												</TableRow>
											</TableHead>
											<TableBody>
												{data_files.length <= 0 ? (
													<TableRow>
														<TableCell component='th' colSpan={2}>
															There are no datasets or artifacts. Upload a
															dataset.
														</TableCell>
													</TableRow>
												) : (
													<>
														{data_files.map((file, key) => (
															<TableRow
																hover
																onClick={() => {
																	navigator.clipboard
																		.writeText(file.url)
																		.then(() => {
																			enqueueSnackbar('Copied', {
																				variant: 'info'
																			})
																		})
																}}
																style={{ cursor: 'pointer' }}
																key={`${key}-${file.name}`}
															>
																<TableCell component='th' scope='Name'>
																	{file.name}
																</TableCell>
																<TableCell component='th' scope='Size'>
																	{convertBytes(file.size)}
																</TableCell>
															</TableRow>
														))}
													</>
												)}
											</TableBody>
										</Table>
									</TableContainer>
								</>
							)}
						</Box>
					</Box>
				</DialogContent>
				<DialogActions>
					<Button
						onClick={() => saveConfig()}
						color='primary'
						disabled={savingConfig}
					>
						Save
					</Button>
				</DialogActions>
			</Dialog>
		</>
	)
}

export default ConfigurationDetailsCard
