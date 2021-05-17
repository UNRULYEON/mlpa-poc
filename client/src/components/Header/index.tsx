import CardContainer from '../CardContainer'
import Box from '@material-ui/core/Box'
import IconButton from '@material-ui/core/IconButton'
import ArrowBackRoundedIcon from '@material-ui/icons/ArrowBackRounded'
import { Link } from 'react-router-dom'

type HeaderProps = {
	backUrl?: string
	title: string
	subtitle?: string
	buttons?: () => JSX.Element
}

const Header: React.FC<HeaderProps> = props => {
	const { backUrl, title, subtitle, buttons } = props

	return (
		<CardContainer component='header'>
			<Box display='flex' alignItems='center' height='36px'>
				{backUrl && (
					<Box mr='12px'>
						<Link to={backUrl}>
							<IconButton aria-label='back' style={{ margin: 0 }}>
								<ArrowBackRoundedIcon />
							</IconButton>
						</Link>
					</Box>
				)}
				<Box
					style={{
						fontFamily: 'Poppins',
						fontWeight: 'bold',
						fontSize: '24px'
					}}
				>
					{title}
				</Box>
				{subtitle && (
					<Box display='flex' alignItems='center'>
						<Box
							mx='12px'
							width='3px'
							height='32px'
							bgcolor='rgba(0, 0, 0, .12)'
						/>
						<Box color='black' fontSize='16px'>
							{subtitle}
						</Box>
					</Box>
				)}
				{buttons && <Box ml='auto'>{buttons()}</Box>}
			</Box>
		</CardContainer>
	)
}

export default Header
