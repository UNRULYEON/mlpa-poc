import { useState } from 'react'
import {
	createStyles,
	Theme,
	withStyles,
	WithStyles
} from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import { Dialog as MuiDialog } from '@material-ui/core'
import MuiDialogTitle from '@material-ui/core/DialogTitle'
import MuiDialogContent from '@material-ui/core/DialogContent'
import MuiDialogActions from '@material-ui/core/DialogActions'
import IconButton from '@material-ui/core/IconButton'
import CloseIcon from '@material-ui/icons/Close'
import Typography from '@material-ui/core/Typography'

const styles = (theme: Theme) =>
	createStyles({
		root: {
			margin: 0,
			padding: theme.spacing(2)
		},
		closeButton: {
			position: 'absolute',
			right: theme.spacing(1),
			top: theme.spacing(1),
			color: theme.palette.grey[500]
		}
	})

export interface DialogTitleProps extends WithStyles<typeof styles> {
	id: string
	children: React.ReactNode
	onClose: () => void
}

const DialogTitle = withStyles(styles)((props: DialogTitleProps) => {
	const { children, classes, onClose, ...other } = props
	return (
		<MuiDialogTitle disableTypography className={classes.root} {...other}>
			<Typography variant='h6'>{children}</Typography>
			{onClose ? (
				<IconButton
					aria-label='close'
					className={classes.closeButton}
					onClick={onClose}
				>
					<CloseIcon />
				</IconButton>
			) : null}
		</MuiDialogTitle>
	)
})

const DialogContent = withStyles((theme: Theme) => ({
	root: {
		padding: theme.spacing(2)
	}
}))(MuiDialogContent)

const DialogActions = withStyles((theme: Theme) => ({
	root: {
		margin: 0,
		padding: theme.spacing(1)
	}
}))(MuiDialogActions)

type DialogProps = {
	open: boolean
	title: string
	buttons: () => JSX.Element
	close: () => void
}

const Dialog: React.FC<DialogProps> = props => {
	const { open, title, buttons, close, children } = props

	const handleClose = () => {
		close()
	}

	return (
		<MuiDialog onClose={handleClose} aria-labelledby='dialog-title' open={open}>
			<DialogTitle id='dialog-title' onClose={handleClose}>
				{title}
			</DialogTitle>
			<DialogContent dividers>{children}</DialogContent>
			<DialogActions>{buttons()}</DialogActions>
		</MuiDialog>
	)
}

export default Dialog
