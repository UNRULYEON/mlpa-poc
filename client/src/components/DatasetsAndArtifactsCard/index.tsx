import useSWR from 'swr'
import CircularProgress from '@material-ui/core/CircularProgress'
import CardContainer from '../CardContainer'
import CardHeader from '../CardHeader'
import CardStatusTable from '../CardStatusTable'
import { DTO_PipelineDatasetsAndArtifactsStatus } from '../../../../DTO/pipeline'
import { useEffect, useState } from 'react'
import { Button as MuiButton } from '@material-ui/core'
import { useSnackbar } from 'notistack'

type DatasetsAndArtifactsCardProps = {
	id: string
}

const DatasetsAndArtifactsCard = (props: DatasetsAndArtifactsCardProps) => {
	const { id } = props
	const { enqueueSnackbar } = useSnackbar()
	const { data } = useSWR<DTO_PipelineDatasetsAndArtifactsStatus>(
		`/api/pipeline/${id}/dataset-and-artifacts/status`
	)
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
		<CardContainer>
			<CardHeader
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
				<>
					<CircularProgress />
				</>
			) : (
				<CardStatusTable
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
		</CardContainer>
	)
}

export default DatasetsAndArtifactsCard
