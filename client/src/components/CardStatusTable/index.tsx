import Box, { BoxProps } from '@material-ui/core/Box'

type StatusTable = {
	head: string
	data: JSX.Element
}

type CardStatusTableProps = {
	table: StatusTable[]
	headWidth?: string
}

const CardStatusTable = (props: CardStatusTableProps & BoxProps) => {
	const { table, headWidth } = props

	return (
		<Box fontSize='16px' {...props}>
			<table>
				<tbody>
					{table.map((row, key) => (
						<tr key={key}>
							<th
								style={{
									textAlign: 'left',
									verticalAlign: 'top',
									width: headWidth ? headWidth : 'auto'
								}}
							>
								{row.head}
							</th>
							<td>{row.data}</td>
						</tr>
					))}
				</tbody>
			</table>
		</Box>
	)
}

export default CardStatusTable
