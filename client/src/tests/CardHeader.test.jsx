import React from 'react'
import { render, unmountComponentAtNode } from 'react-dom'
import { act } from 'react-dom/test-utils'
import CardHeader from '../components/CardHeader'
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

describe('CardHeader', () => {
	it('renders title', () => {
		act(() => {
			render(
				<Root>
					<CardHeader
						status='gray'
						title='Card header title'
						buttons={() => <></>}
					/>
				</Root>,
				container
			)
		})

		expect(container.textContent).toEqual('Card header title')
	})

	it('renders title with gray status', () => {
		act(() => {
			render(
				<Root>
					<CardHeader
						status='gray'
						title='Card header title'
						buttons={() => <></>}
					/>
				</Root>,
				container
			)
		})

		const cardHeaderStatus = document.querySelector('div.card-header-status')

		expect(cardHeaderStatus).toHaveStyle('background-color: gray')
	})

	it('renders title with red status', () => {
		act(() => {
			render(
				<Root>
					<CardHeader
						status='red'
						title='Card header title'
						buttons={() => <></>}
					/>
				</Root>,
				container
			)
		})

		const cardHeaderStatus = document.querySelector('div.card-header-status')

		expect(cardHeaderStatus).toHaveStyle('background-color: red')
	})

	it('renders title with orange status', () => {
		act(() => {
			render(
				<Root>
					<CardHeader
						status='orange'
						title='Card header title'
						buttons={() => <></>}
					/>
				</Root>,
				container
			)
		})

		const cardHeaderStatus = document.querySelector('div.card-header-status')

		expect(cardHeaderStatus).toHaveStyle('background-color: orange')
	})

	it('renders title with green status', () => {
		act(() => {
			render(
				<Root>
					<CardHeader
						status='green'
						title='Card header title'
						buttons={() => <></>}
					/>
				</Root>,
				container
			)
		})

		const cardHeaderStatus = document.querySelector('div.card-header-status')

		expect(cardHeaderStatus).toHaveStyle('background-color: green')
	})
})
