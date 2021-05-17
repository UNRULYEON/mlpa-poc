import { Button as MuiButton } from '@material-ui/core'
import { ButtonProps as MuiButtonProps } from '@material-ui/core/Button'

type ButtonProps = {} & MuiButtonProps

const Button: React.FC<ButtonProps> = (props): JSX.Element => {
	const { disabled, children } = props

	return (
		<MuiButton
			variant='contained'
			color='primary'
			disableElevation
			{...props}
			style={{ fontWeight: 'bold' }}
		>
			{children}
		</MuiButton>
	)
}

export default Button
