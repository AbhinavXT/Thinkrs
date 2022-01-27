import { useEffect, useState } from 'react'
import { ethers } from 'ethers'
import Head from 'next/head'
import axios from 'axios'

import { nftContractAddress, nftMarketAddress } from '../config.js'

import NFT from '../utils/NFT.json'
import Market from '../utils/NFTMarket.json'

import { useRouter } from 'next/router'

export default function Home() {
	const [nfts, setNfts] = useState([])

	const router = useRouter()

	// Routes to the buynft page
	const buyToken = (tokenId, itemId) => {
		router.push({
			pathname: '/buynft',
			query: { tokenid: tokenId, itemid: itemId },
		})
	}

	// Fetches the marketplace items put for sale
	const loadNFT = async () => {
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

				const itemsData = await marketContract.fetchNftItems()

				const items = await Promise.all(
					itemsData.map(async (i) => {
						const tokenUri = await nftContract.tokenURI(i.tokenId)
						const meta = await axios.get(tokenUri)

						let price = ethers.utils.formatUnits(i.price.toString(), 'ether')

						let item = {
							price,
							itemId: i.itemId.toNumber(),
							tokenId: i.tokenId.toNumber(),
							seller: i.seller,
							owner: i.owner,
							image: meta.data.image,
							name: meta.data.name,
							description: meta.data.description,
						}
						return item
					})
				)

				setNfts(items)
			} else {
				console.log("Ethereum object doesn't exist!")
			}
		} catch (error) {
			console.log('Error loading eternal nft', error)
		}
	}

	useEffect(() => {
		loadNFT()
	}, [])

	return (
		<div className='flex flex-col justify-center items-center text-gray-200'>
			<Head>
				<title>Explore NFTs</title>
				<meta name='description' content='Explore NFTs' />
				<link rel='icon' href='/favicon.ico' />
			</Head>

			<div className='font-bold text-4xl mt-12'>Explore NFTs</div>

			<div>
				{nfts.length ? (
					<div className='flex flex-col justify-center items-center'>
						<div className='flex justify-center'>
							<div className='px-4'>
								<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mt-16'>
									{nfts.map((nft, i) => (
										<button
											key={i}
											onClick={() => buyToken(nft.tokenId, nft.itemId)}
											className='bg-gray-900 shadow-md shadow-green-500 rounded-lg overflow-hidden w-72 h-80 hover:shadow-green-400 hover:shadow-lg hover:scale-[1.02] transition duration-500 ease-in-out'
										>
											<img src={nft.image} className='w-full h-56 p-4' />

											<div className='flex flex-col font-bold'>
												<div className='flex justify-between px-4'>
													<div>Id</div>
													<div>{nft.tokenId}</div>
												</div>
												<div className='flex justify-between px-4'>
													<div>Name</div>
													<div>{nft.name}</div>
												</div>
												<div className='flex justify-between px-4'>
													<div>Price</div>
													<div>{nft.price} Ξ</div>
												</div>
											</div>
										</button>
									))}
								</div>
							</div>
						</div>
					</div>
				) : (
					<div className='text-centre font-bold text-xl mt-16'>
						No Items in Marketplace
					</div>
				)}
			</div>
		</div>
	)
}
