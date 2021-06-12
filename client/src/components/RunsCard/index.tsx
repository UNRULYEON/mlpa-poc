import useSWR, { mutate } from 'swr'
import { useHistory } from 'react-router-dom'
import CardContainer from '../CardContainer'
import CardHeader from '../CardHeader'
import Box from '@material-ui/core/Box'
import Switch from '@material-ui/core/Switch'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import { Runs } from '../../../../DTO/run'
import { DTO_PipelineStatus } from '../../../../DTO/pipeline'
import { useEffect, useRef, useState } from 'react'

type RunsCardProps = {
	id: string
}

const RunsCard = (props: RunsCardProps) => {
	let history = useHistory()
	const { id } = props
	const { data, error } = useSWR<Runs>(`/api/pipeline/${id}/runs`)
	const { data: data_pipelineStatus, error: error_pipelineStatus } =
		useSWR<DTO_PipelineStatus>(`/api/pipeline/${id}/status`)
	const { data: data_runOutput, error: error_runOutput } = useSWR<string>(
		data_pipelineStatus && data_pipelineStatus.status === 'RUNNING'
			? `/api/pipeline/${data_pipelineStatus.Run[0].id}/update`
			: null
	)

	const outputDiv = useRef<HTMLDivElement>(null)

	useEffect(() => {
		if (data_pipelineStatus) {
			const fetchoutput = async () => {
				while (data_pipelineStatus?.status === 'RUNNING') {
					await new Promise(r => setTimeout(r, 5000))
					mutate(`/api/pipeline/${data_pipelineStatus.Run[0].id}/update`).then(
						output => {
							if (output?.includes('[MLPA] - DONE')) {
								console.log('DELETE INSTANCE!')
								fetch(
									`/api/pipeline/${data_pipelineStatus.Run[0].id}/terminate`
								).then(() => mutate(`/api/pipeline/${id}/status`))
							}
							if (outputDiv.current) {
								outputDiv.current.scrollIntoView({ behavior: 'smooth' })
							}
						}
					)
					mutate(`/api/pipeline/${id}/dataset-and-artifacts/files`)
				}
			}

			fetchoutput()
		}
	}, [data_pipelineStatus])

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
		<CardContainer>
			<Box>
				<CardHeader title='Run' />
			</Box>
			{error ? (
				<>err</>
			) : !data ? (
				<>loading</>
			) : (
				<>
					{data_runOutput && (
						<div
							style={{
								wordBreak: 'break-word',
								whiteSpace: 'pre-wrap',
								overflow: 'auto',
								maxHeight: '642px'
							}}
						>
							{data_runOutput}
							<div ref={outputDiv}></div>
						</div>
					)}
				</>
			)}
		</CardContainer>
	)
}

export default RunsCard
