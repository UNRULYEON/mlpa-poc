import React, { useEffect, useState } from 'react'
import useSWR, { mutate } from 'swr'
import CircularProgress from '@material-ui/core/CircularProgress'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import Box from '@material-ui/core/Box'
import DialogTitle from '@material-ui/core/DialogTitle'
import Editor from '@monaco-editor/react'
import { useSnackbar } from 'notistack'
import CardContainer from '../CardContainer'
import CardHeader from '../CardHeader'
import CardStatusTable from '../CardStatusTable'
import Button from '../Button'
import { DTO_PipelineConfigurationStatus } from '../../../../DTO/pipeline'
import { DTO_PipelineConfiguration } from '../../../../DTO/configuration'

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
				maxWidth='md'
				open={configDialogOpen}
				onClose={handleCloseConfigDialog}
				aria-labelledby='config-editor-dialog-title'
				aria-describedby='config-editor-dialog-description'
			>
				<DialogTitle id='config-editor-dialog-title'>
					Edit configuration
				</DialogTitle>
				<DialogContent style={{ overflowY: 'hidden' }}>
					<Box borderRadius='20px' border='1px'>
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
