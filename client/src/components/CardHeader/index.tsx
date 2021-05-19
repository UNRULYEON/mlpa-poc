import Box from '@material-ui/core/Box'
import Grid from '@material-ui/core/Grid'

type CardHeaderProps = {
	status?: 'red' | 'orange' | 'green' | 'gray'
	title: string
	buttons?: () => JSX.Element
}

const CardHeader = (props: CardHeaderProps) => {
	const { status, title, buttons } = props

	return (
		<Box mb='12px'>
			<Grid container direction='row' alignItems='center'>
				<Grid item xs>
					{status && (
						<Box
							width='15px'
							height='15px'
							bgcolor={status}
							borderRadius='50%'
							display='inline-block'
							mr='12px'
						/>
					)}
					<Box
						fontFamily='Poppins'
						fontWeight='bold'
						fontSize='24px'
						display='inline-block'
					>
						{title}
					</Box>
				</Grid>
				{buttons && <Grid item>{buttons()}</Grid>}
			</Grid>
		</Box>
	)
}

export default CardHeader
