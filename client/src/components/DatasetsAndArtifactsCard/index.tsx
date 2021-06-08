import useSWR, { mutate } from 'swr'
import CircularProgress from '@material-ui/core/CircularProgress'
import Box from '@material-ui/core/Box'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import CardContainer from '../CardContainer'
import CardHeader from '../CardHeader'
import CardStatusTable from '../CardStatusTable'
import { DTO_PipelineDatasetsAndArtifactsStatus } from '../../../../DTO/pipeline'
import { DTO_PipelineDatasetsAndArtifactsFile } from '../../../../DTO/datasets-and-artifacts'
import { useEffect, useState } from 'react'
import { Button as MuiButton } from '@material-ui/core'
import { useSnackbar } from 'notistack'
import { convertBytes } from '../../utils'

type DatasetsAndArtifactsCardProps = {
	id: string
}

const DatasetsAndArtifactsCard = (props: DatasetsAndArtifactsCardProps) => {
	const { id } = props
	const { enqueueSnackbar } = useSnackbar()
	const { data } = useSWR<DTO_PipelineDatasetsAndArtifactsStatus>(
		`/api/pipeline/${id}/dataset-and-artifacts/status`
	)
	const { data: data_files, error: error_files } = useSWR<
		DTO_PipelineDatasetsAndArtifactsFile[]
	>(`/api/pipeline/${id}/dataset-and-artifacts/files`)
	const [selectedFile, setSelectedFile] = useState<File | null>(null)
	const [isUploading, setIsUploadng] = useState<boolean>(false)

	useEffect(() => {
		if (selectedFile) {
			const formData = new FormData()

			formData.append(selectedFile.name, selectedFile, selectedFile.name)

			setIsUploadng(true)
			fetch(`/api/pipeline/${id}/dataset-and-artifacts/upload`, {
				method: 'POST',
				body: formData
			})
				.then(r => {
					if (r.ok) {
						enqueueSnackbar('Upload successful', {
							variant: 'success'
						})
						mutate(`/api/pipeline/${id}/dataset-and-artifacts/files`)
					} else {
						enqueueSnackbar('Something went wrong uploading', {
							variant: 'error'
						})
						setSelectedFile(null)
					}
				})
				.catch(e => {
					console.log(e)
					enqueueSnackbar('Something went wrong uploading', {
						variant: 'error'
					})
				})
				.finally(() => {
					setIsUploadng(false)
					setSelectedFile(null)
				})
		}
	}, [id, selectedFile, enqueueSnackbar])

	const getDatasetsAndArtifactsStatusColor = (status: boolean) => {
		switch (status) {
			case true:
				return 'green'
			case false:
				return 'red'
			default:
				return 'gray'
		}
	}

	return (
		<CardContainer px={0}>
			<CardHeader
				px={3}
				status={
					!data ? 'gray' : getDatasetsAndArtifactsStatusColor(data.deployed)
				}
				title='Datasets / Artifacts'
				buttons={() => (
					<>
						<input
							accept='*'
							type='file'
							id='dataset-or-artifact-file'
							onChange={e =>
								e.target.files && setSelectedFile(e.target.files[0])
							}
							hidden
						/>
						<label htmlFor='dataset-or-artifact-file'>
							<MuiButton
								variant='outlined'
								component='span'
								disabled={!data || isUploading}
							>
								upload dataset
							</MuiButton>
						</label>
					</>
				)}
			/>
			{!data ? (
				<Box p={3}>
					<CircularProgress />
				</Box>
			) : (
				<CardStatusTable
					px={3}
					table={[
						{
							head: 'Status:',
							data: <>{data.deployed ? 'Deployed' : 'Not deployed'}</>
						},
						{
							head: 'Endpoint:',
							data: <>{data.endpoint.length > 0 ? data.endpoint : '-'}</>
						}
					]}
					headWidth='80px'
				/>
			)}
			{error_files ? (
				<>err</>
			) : !data_files ? (
				<></>
			) : (
				<Table aria-label='simple table'>
					<TableHead>
						<TableRow>
							<TableCell>Name</TableCell>
							<TableCell>Size</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{data_files.length <= 0 ? (
							<TableRow>
								<TableCell component='th' colSpan={2}>
									There are no datasets or artifacts. Upload a dataset.
								</TableCell>
							</TableRow>
						) : (
							<>
								{data_files.map((file, key) => (
									<TableRow
										hover
										onClick={() => {
											window.open(
												`http://localhost:8000/api/pipeline/${id}/dataset-and-artifacts/file/${file.download_id}`,
												'_blank'
											)
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
			)}
		</CardContainer>
	)
}

export default DatasetsAndArtifactsCard
