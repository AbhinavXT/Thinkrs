import { useEffect, useState, useCallback } from 'react'
import { ethers } from 'ethers'

import { nftContractAddress, nftMarketAddress } from '../config.js'

import NFT from '../utils/NFT.json'
import Market from '../utils/NFTMarket.json'
import axios from 'axios'

import { useRouter } from 'next/router'

const profile = () => {
	const [nfts, setNfts] = useState([])
	const [boughtNfts, setBoughtNfts] = useState([])

	const router = useRouter()

	let account

	// Routes to sellnft page
	const sellToken = (tokenId) => {
		router.push({
			pathname: '/sellnft',
			query: { id: tokenId },
		})
	}

	// Gets data of NFTs bought from the marketplace
	const loadBoughtNFT = async () => {
		try {
			const { ethereum } = window

			if (ethereum) {
				const provider = await new ethers.providers.Web3Provider(ethereum)
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

				const data = await marketContract.fetchMyNftItems()

				const items = await Promise.all(
					data.map(async (i) => {
						const tokenUri = await nftContract.tokenURI(i.tokenId)
						const meta = await axios.get(tokenUri)
						let price = ethers.utils.formatUnits(i.price.toString(), 'ether')
						let item = {
							price,
							tokenId: i.tokenId.toNumber(),
							seller: i.seller,
							owner: i.owner,
							image: meta.data.image,
						}
						return item
					})
				)
				setBoughtNfts(items)
			} else {
				console.log("Ethereum object doesn't exist!")
			}
		} catch (error) {
			console.log('Error loading NFT nft', error)
		}
	}

	// Gets data of NFTs minted by the user
	const loadMyNFT = async () => {
		try {
			const { ethereum } = window

			if (ethereum) {
				const provider = await new ethers.providers.Web3Provider(ethereum)
				const signer = provider.getSigner()
				const nftContract = new ethers.Contract(
					nftContractAddress,
					NFT.abi,
					signer
				)

				account = await signer.getAddress()

				const itemsData = await nftContract.getMyNFT()

				const items = await Promise.all(
					itemsData.map(async (i) => {
						const tokenId = i[0].toNumber()
						const tokenOwner = await nftContract.ownerOf(tokenId)
						const tokenUri = i[2]
						const meta = await axios.get(tokenUri)

						let item = {
							id: tokenId,
							name: meta.data.name,
							description: meta.data.description,
							image: meta.data.image,
							owner: tokenOwner,
						}
						return item
					})
				)
				const mintedItems = items.filter((item) => item.owner === account)

				setNfts(mintedItems)
			} else {
				console.log("Ethereum object doesn't exist!")
			}
		} catch (error) {
			console.log('Error loading NFT nft', error)
		}
	}

	useEffect(() => {
		loadMyNFT()
		loadBoughtNFT()
	}, [])

	return (
		<div className='flex flex-col justify-center items-center text-white'>
			<div className='flex justify-center'>
				<div className='px-4 mt-12'>
					<div className='text-center text-2xl font-extrabold'>
						Minted NFT Items
					</div>
					{nfts.length === 0 ? (
						<div className='text-center text-lg font-semibold mt-4'>
							No minted items.
						</div>
					) : (
						<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 pt-4 mt-4'>
							{nfts.map((nft, i) => (
								<button
									key={i}
									onClick={() => sellToken(nft.id)}
									className='flex flex-col gap-y-4 items-center border shadow-md shadow-green-500 rounded-lg overflow-hidden w-72 h-80 hover:shadow-green-400 hover:shadow-lg hover:scale-[1.02] transition duration-500 ease-in-out'
								>
									<img src={nft.image} className='rounded-lg mt-4 w-56 h-56' />
									<div className='flex font-bold flex-col'>
										<div className='flex gap-x-[150px]'>
											<div>Name</div>
											<div>{nft.name}</div>
										</div>
										<div className='flex gap-x-[150px]'>
											<div>TokenId</div>
											<div>{nft.id}</div>
										</div>
									</div>
								</button>
							))}
						</div>
					)}
				</div>
			</div>
			<div className='flex justify-center'>
				<div className='px-4 mt-12'>
					<div className='text-center text-2xl font-extrabold'>
						Bought NFT Items
					</div>
					{boughtNfts.length === 0 ? (
						<div className='text-lg font-semibold mt-4'>
							No bought NFT items.
						</div>
					) : (
						<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 pt-4 mt-4 pb-8'>
							{boughtNfts.map((boughtNft, i) => (
								<div
									key={i}
									className='border shadow-lg rounded-xl overflow-hidden w-60 border-gray-300 hover:shadow-lg hover:scale-105 transition duration-500 ease-in-out'
								>
									<img src={boughtNft.image} />
									<div className='flex items-center justify-center text-xl font-bold py-2 px-4'>
										<div>#{boughtNft.tokenId}</div>
									</div>
								</div>
							))}
						</div>
					)}
				</div>
			</div>
		</div>
	)
}

export default profile
