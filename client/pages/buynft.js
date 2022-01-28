import { useState, useEffect } from 'react'
import { ethers } from 'ethers'
import axios from 'axios'

import { nftContractAddress, nftMarketAddress } from '../config.js'

import NFT from '../utils/NFT.json'
import Market from '../utils/NFTMarket.json'

import { useRouter } from 'next/router'

const buynft = () => {
	const [nft, setNft] = useState({})
	const [id, setId] = useState(null)
	const [tokenData, setTokenData] = useState({})

	const router = useRouter()

	// Fetch NFT data to display
	const getNFTData = async () => {
		try {
			const { ethereum } = window

			if (ethereum) {
				const provider = new ethers.providers.Web3Provider(ethereum)
				const signer = provider.getSigner()
				const nftContract = new ethers.Contract(
					nftContractAddress,
					NFT.abi,
					signer
				)
				const marketContract = new ethers.Contract(
					nftMarketAddress,
					Market.abi,
					signer
				)

				const tokenId = router.query.tokenid
				setId(tokenId)

				const itemId = router.query.itemid

				const itemData = await nftContract.tokenURI(tokenId)
				const data = await axios.get(itemData)
				setNft(data.data)

				const tokenData = await marketContract.fetchNftItemById(itemId)

				const itemPrice = ethers.utils.formatEther(tokenData[5])

				const EternalToken = {
					seller: tokenData[3],
					price: itemPrice,
				}
				setTokenData(EternalToken)
			} else {
				console.log("Ethereum object doesn't exist!")
			}
		} catch (error) {
			console.log('Error fetching token data', error)
		}
	}

	// Creates transaction to buy NFT from the marketplace
	const buyEternalNft = async () => {
		try {
			const { ethereum } = window

			if (ethereum) {
				const provider = await new ethers.providers.Web3Provider(ethereum)
				const signer = provider.getSigner()

				const marketContract = new ethers.Contract(
					nftMarketAddress,
					Market.abi,
					signer
				)

				const itemId = router.query.itemid

				const tokenData = await marketContract.fetchNftItemById(itemId)
				const price = ethers.utils.parseUnits(tokenData[5].toString(), 'wei')

				const tx = await marketContract.createNftItemSale(
					nftContractAddress,
					itemId,
					{
						value: price,
					}
				)
				console.log('Mining:', tx.hash)
				await tx.wait()

				console.log('Mined!', tx.hash)

				router.push('/profile')
			} else {
				console.log("Ethereum object doesn't exist!")
			}
		} catch (error) {
			console.log('Error Mining transaction', error)
		}
	}

	useEffect(() => {
		if (!router.isReady) return
		getNFTData()
	}, [router.isReady])

	return (
		<div className='flex px-60 pt-20 gap-x-20 text-gray-300'>
			<div className='flex flex-col w-3/6 gap-y-8'>
				<div className='flex justify-center items-center h-96 w-full'>
					<img src={nft.image} alt='' className='h-80 rounded-xl shadow-xl' />
				</div>
				<div>
					<div className='flex justify-center items-center text-black bg-gray-300 font-bold h-16 w-full text-lg rounded-lg shadow-xl'>
						{nft.description}
					</div>
				</div>
				<div>
					<div className='flex flex-col gap-y-2 w-full px-4 py-4 text-black bg-gray-300 font-bold rounded-lg shadow-xl'>
						<div className='flex justify-between'>
							<div>TokenId:</div>
							<div>{id}</div>
						</div>
						<div className='flex justify-between'>
							<div>Token Standard:</div>
							<div>ERC-721</div>
						</div>
						<div className='flex justify-between'>
							<div>Blockchain:</div>
							<div>Rinkeby</div>
						</div>
					</div>
				</div>
			</div>
			<div className='flex flex-col font-bold w-full py-8 px-12 gap-y-12'>
				<div className='text-4xl'>{nft.name}</div>
				<div className='flex gap-x-4 text-xl'>
					<div>Owned by:</div>
					<div className='text-gray-200'>{tokenData.seller}</div>
				</div>
				<div className='flex gap-x-4 text-xl'>
					<div>Contract Address:</div>
					<div className='text-gray-200'>{nftContractAddress}</div>
				</div>
				<div className='flex gap-x-4 text-xl'>
					<div>Price:</div>
					<div className='text-gray-200'>{tokenData.price} ETH</div>
				</div>
				<div className='flex flex-col gap-y-4 w-96'>
					<button
						onClick={buyEternalNft}
						className='flex justify-center items-center h-12 rounded-lg shadow-lg bg-green-400 text-black font-bold text-lg cursor-pointer hover:shadow-lg hover:scale-[1.03] transition duration-500 ease-in-out'
					>
						Buy
					</button>
				</div>
			</div>
		</div>
	)
}

export default buynft
