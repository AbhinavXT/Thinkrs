import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'

const Navbar = () => {
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
		<div className='h-full py-8 text-white'>
			<div className='flex items-center px-20 justify-between shadow-xl'>
				<Link href='/'>
					<div className='flex gap-x-4 font-extrabold text-3xl cursor-pointer'>
						<div>Thinkrs</div>
					</div>
				</Link>

				<div className='flex text-lg '>
					{pages.map((page, i) => (
						<Link key={i} href={page.path}>
							<div className='flex items-center px-4 justify-center rounded-full cursor-pointer transition duration-500 ease-in-out h-12 w-24 hover:bg-gray-800 hover:text-gray-200 hover:shadow-xl'>
								{page.name}
							</div>
						</Link>
					))}
				</div>

				<div>
					<input
						type='text'
						placeholder='Search anything...'
						className='h-12 w-[1000px] text-black rounded-full shadow-lg px-4 font-bold bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-800 focus:border-transparent'
					></input>
				</div>
				<button className='flex items-center gap-x-3 p-2 rounded-full'>
					<div>
						<svg
							xmlns='http://www.w3.org/2000/svg'
							width='24'
							height='24'
							fill='currentColor'
							viewBox='0 0 16 16'
						>
							<path d='M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm7.5-6.923c-.67.204-1.335.82-1.887 1.855A7.97 7.97 0 0 0 5.145 4H7.5V1.077zM4.09 4a9.267 9.267 0 0 1 .64-1.539 6.7 6.7 0 0 1 .597-.933A7.025 7.025 0 0 0 2.255 4H4.09zm-.582 3.5c.03-.877.138-1.718.312-2.5H1.674a6.958 6.958 0 0 0-.656 2.5h2.49zM4.847 5a12.5 12.5 0 0 0-.338 2.5H7.5V5H4.847zM8.5 5v2.5h2.99a12.495 12.495 0 0 0-.337-2.5H8.5zM4.51 8.5a12.5 12.5 0 0 0 .337 2.5H7.5V8.5H4.51zm3.99 0V11h2.653c.187-.765.306-1.608.338-2.5H8.5zM5.145 12c.138.386.295.744.468 1.068.552 1.035 1.218 1.65 1.887 1.855V12H5.145zm.182 2.472a6.696 6.696 0 0 1-.597-.933A9.268 9.268 0 0 1 4.09 12H2.255a7.024 7.024 0 0 0 3.072 2.472zM3.82 11a13.652 13.652 0 0 1-.312-2.5h-2.49c.062.89.291 1.733.656 2.5H3.82zm6.853 3.472A7.024 7.024 0 0 0 13.745 12H11.91a9.27 9.27 0 0 1-.64 1.539 6.688 6.688 0 0 1-.597.933zM8.5 12v2.923c.67-.204 1.335-.82 1.887-1.855.173-.324.33-.682.468-1.068H8.5zm3.68-1h2.146c.365-.767.594-1.61.656-2.5h-2.49a13.65 13.65 0 0 1-.312 2.5zm2.802-3.5a6.959 6.959 0 0 0-.656-2.5H12.18c.174.782.282 1.623.312 2.5h2.49zM11.27 2.461c.247.464.462.98.64 1.539h1.835a7.024 7.024 0 0 0-3.072-2.472c.218.284.418.598.597.933zM10.855 4a7.966 7.966 0 0 0-.468-1.068C9.835 1.897 9.17 1.282 8.5 1.077V4h2.355z' />
						</svg>
					</div>
					<div className='font-bold text-lg'>EN</div>
				</button>
				<button
					className='flex items-center justify-center bg-green-400 h-12 w-12 text-black rounded-full'
					onClick={connectWallet}
				>
					<svg
						xmlns='http://www.w3.org/2000/svg'
						width='24'
						height='24'
						fill='currentColor'
						class='bi bi-wallet'
						viewBox='0 0 16 16'
					>
						<path d='M0 3a2 2 0 0 1 2-2h13.5a.5.5 0 0 1 0 1H15v2a1 1 0 0 1 1 1v8.5a1.5 1.5 0 0 1-1.5 1.5h-12A2.5 2.5 0 0 1 0 12.5V3zm1 1.732V12.5A1.5 1.5 0 0 0 2.5 14h12a.5.5 0 0 0 .5-.5V5H2a1.99 1.99 0 0 1-1-.268zM1 3a1 1 0 0 0 1 1h12V2H2a1 1 0 0 0-1 1z' />
					</svg>
				</button>
			</div>
		</div>
	)
}

export default Navbar