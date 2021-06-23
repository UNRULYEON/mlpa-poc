import { RecoilRoot } from 'recoil'
import { SWRConfig } from 'swr'
import { SnackbarProvider } from 'notistack'

export const Root = props => (
	<SWRConfig
		value={{
			fetcher: (...args) =>
				fetch(...args)
					.then(async res => (props.data ? props.data : {}))
					.catch(e => {
						console.log(e)
						throw e
					}),
			revalidateOnFocus: false,
			dedupingInterval: 0
		}}
	>
		<RecoilRoot>
			<SnackbarProvider>{props.children}</SnackbarProvider>
		</RecoilRoot>
	</SWRConfig>
)
