import { useState } from 'react'
import Header from '../components/Header'
import Button from '../components/Button'
import Dialog from '../components/Dialog'

const PipelinesPage = () => {
	const [createDialog, setCreateDialog] = useState<boolean>(false)
	return (
		<>
			<Header
				title='Pipelines'
				buttons={() => (
					<Button onClick={() => setCreateDialog(true)}>Create pipeline</Button>
				)}
			/>
			<Dialog
				open={createDialog}
				close={() => setCreateDialog(false)}
				title='Create a new pipeline'
				buttons={() => <Button>Create</Button>}
			></Dialog>
		</>
	)
}

export default PipelinesPage
