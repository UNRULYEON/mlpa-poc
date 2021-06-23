import React from 'react'
import { render, unmountComponentAtNode } from 'react-dom'
import { act } from 'react-dom/test-utils'
import Dialog from '../components/Dialog'

let container = null
beforeEach(() => {
	// setup a DOM element as a render target
	container = document.createElement('div')
	document.body.appendChild(container)
})

afterEach(() => {
	// cleanup on exiting
	unmountComponentAtNode(container)
	container.remove()
	container = null
})

describe('Dialog', () => {
	it('renders with title', () => {
		act(() => {
			render(
				<Dialog
					open
					title='Dialog title'
					buttons={() => <></>}
					close={() => {}}
				>
					Dialog body
				</Dialog>,
				container
			)
		})

		const dialogTitle = document.querySelector('#dialog-title')

		expect(dialogTitle.textContent).toBe('Dialog title')
	})
	it('renders with body', () => {
		act(() => {
			render(
				<Dialog
					open
					title='Dialog title'
					buttons={() => <></>}
					close={() => {}}
				>
					Dialog body
				</Dialog>,
				container
			)
		})

		const dialogBody = document.querySelector('#dialog-content')

		expect(dialogBody.textContent).toBe('Dialog body')
	})
})
