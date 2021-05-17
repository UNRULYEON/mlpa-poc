import Box, { BoxProps } from '@material-ui/core/Box'

type CardContainerProps = {} & BoxProps

const CardContainer: React.FC<CardContainerProps> = props => {
	return (
		<Box
			bgcolor='white'
			border={1}
			borderColor='rgba(0, 0, 0, .12)'
			borderRadius={15}
			p='24px'
			mb='24px'
			{...props}
		>
			{props.children}
		</Box>
	)
}

export default CardContainer
