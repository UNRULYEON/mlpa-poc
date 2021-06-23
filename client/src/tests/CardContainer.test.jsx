import React from 'react'
import { render, unmountComponentAtNode } from 'react-dom'
import { act } from 'react-dom/test-utils'
import CardContainer from '../components/CardContainer'
import { Root } from './index'
import { cache } from 'swr'

let container = null
beforeEach(() => {
	// setup a DOM element as a render target
	container = document.createElement('div')
	document.body.appendChild(container)
})

afterEach(async () => {
	// cleanup on exiting
	cache.clear()
	unmountComponentAtNode(container)
	container.remove()
	container = null
})

describe('CardContainer', () => {
	it('renders text', () => {
		act(() => {
			render(
				<Root>
					<CardContainer>
						<span id='test-me'>I should be rendered!</span>
					</CardContainer>
				</Root>,
				container
			)
		})

		const header = container.querySelector('#test-me')
		expect(header.textContent).toEqual('I should be rendered!')
	})
})
