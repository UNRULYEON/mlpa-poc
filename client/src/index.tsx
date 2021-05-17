import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import App from './App'
import { SWRConfig } from 'swr'
import { RecoilRoot } from 'recoil'
import CssBaseline from '@material-ui/core/CssBaseline'
import { ThemeProvider } from '@material-ui/styles'
import theme from './theme'
import reportWebVitals from './reportWebVitals'

ReactDOM.render(
	<React.StrictMode>
		<SWRConfig
			value={{
				fetcher: (...args: Parameters<typeof fetch>) =>
					fetch(...args)
						.then(async res => {
							const json = await res.json()
							if (res.ok) {
								if (process.env.NODE_ENV === 'development') {
									// console.groupCollapsed(`\x1b[32m[${r.statusText}]\x1b[37m ${r.url} -> ${r.status}`)
									console.groupCollapsed(
										`%c [${res.statusText}] ${res.url} -> ${res.status}`,
										'color: green'
									)
									console.groupCollapsed('Headers')
									new Array(res.headers.entries()).forEach(h =>
										console.log(`${h.next().value}`)
									)
									console.groupEnd()
									console.log(json)
									console.groupEnd()
								}

								return json
							} else {
								throw json
							}
						})
						.catch(e => {
							console.log(e)
							throw e
						}),
				revalidateOnFocus: false
			}}
		>
			<RecoilRoot>
				<ThemeProvider theme={theme}>
					<CssBaseline />
					<App />
				</ThemeProvider>
			</RecoilRoot>
		</SWRConfig>
	</React.StrictMode>,
	document.getElementById('root')
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
