import React from 'react'
import { render, unmountComponentAtNode } from 'react-dom'
import { act } from 'react-dom/test-utils'
import Button from '../components/Button'

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

describe('Button', () => {
	it('renders with text', () => {
		act(() => {
			render(<Button>hello world</Button>, container)
		})

		const button = document.querySelector('button')

		expect(button.textContent).toBe('hello world')
	})

	it('renders disabled', () => {
		act(() => {
			render(<Button disabled>hello world</Button>, container)
		})

		const button = document.querySelector('button')

		expect(button.textContent).toBe('hello world')
		expect(button).toBeDisabled()
	})
})
