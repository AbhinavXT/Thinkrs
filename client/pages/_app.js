import 'tailwindcss/tailwind.css'
import Link from 'next/link'
import { useState, useEffect } from 'react'

import { useRouter } from 'next/router'

function MyApp({ Component, pageProps }) {
	const [currentAccount, setCurrentAccount] = useState('')
	const [correctNetwork, setCorrectNetwork] = useState(false)

	const router = useRouter()

	const pages = [
		{
			name: 'Explore',
			path: '/explore',
		},
		{
			name: 'Collections',
			path: '/collections',
		},
		{
			name: 'Rewards',
			path: '/rewards',
		},
	]

	// Checks if wallet is connected
	const checkIfWalletIsConnected = async () => {
		const { ethereum } = window
		if (ethereum) {
			console.log('Got the ethereum obejct: ', ethereum)
		} else {
			console.log('No Wallet found. Connect Wallet')
		}

		const accounts = await ethereum.request({ method: 'eth_accounts' })

		if (accounts.length !== 0) {
			console.log('Found authorized Account: ', accounts[0])
			setCurrentAccount(accounts[0])
		} else {
			console.log('No authorized account found')
		}
	}

	// Calls Metamask to connect wallet on clicking Connect Wallet button
	const connectWallet = async () => {
		try {
			const { ethereum } = window

			if (!ethereum) {
				console.log('Metamask not detected')
				return
			}
			let chainId = await ethereum.request({ method: 'eth_chainId' })
			console.log('Connected to chain:' + chainId)

			const rinkebyChainId = '0x4'

			const devChainId = 1337
			const localhostChainId = `0x${Number(devChainId).toString(16)}`

			if (chainId !== rinkebyChainId && chainId !== localhostChainId) {
				alert('You are not connected to the Rinkeby Testnet!')
				return
			}

			const accounts = await ethereum.request({ method: 'eth_requestAccounts' })

			console.log('Found account', accounts[0])
			setCurrentAccount(accounts[0])
		} catch (error) {
			console.log('Error connecting to metamask', error)
		}
	}

	// Checks if wallet is connected to the correct network
	const checkCorrectNetwork = async () => {
		const { ethereum } = window
		let chainId = await ethereum.request({ method: 'eth_chainId' })
		console.log('Connected to chain:' + chainId)

		const rinkebyChainId = '0x4'

		const devChainId = 1337
		const localhostChainId = `0x${Number(devChainId).toString(16)}`

		if (chainId !== rinkebyChainId && chainId !== localhostChainId) {
			setCorrectNetwork(false)
		} else {
			setCorrectNetwork(true)
		}
	}

	useEffect(() => {
		checkIfWalletIsConnected()
		checkCorrectNetwork()
	}, [])

	return (
		<div className='bg-black h-full min-h-screen text-white pt-8'>
			<div className='flex items-baseline px-20 justify-between shadow-xl'>
				<Link href='/'>
					<div className='flex gap-x-4 font-extrabold text-3xl cursor-pointer'>
						<div>Thinkrs</div>
					</div>
				</Link>

				<div className='flex text-lg '>
					{pages.map((page, i) => (
						<Link key={i} href={page.path}>
							<div className='flex items-center justify-center rounded-full cursor-pointer transition duration-500 ease-in-out h-12 w-24 hover:bg-gray-800 hover:text-gray-200 hover:shadow-xl'>
								{page.name}
							</div>
						</Link>
					))}
				</div>
			</div>
			<Component {...pageProps} />
		</div>
	)
}

export default MyApp
