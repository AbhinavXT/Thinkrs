import { useEffect, useState, useCallback } from "react"
import { ethers } from "ethers"

import { nftContractAddress, nftMarketAddress } from "../config.js"

import NFT from "../../artifacts/contracts/NFT.sol/NFT.json"
import Market from "../../artifacts/contracts/NFTMarket.sol/NFTMarket.json"
import axios from "axios"

import { useRouter } from "next/router"

const profile = () => {
	const [nfts, setNfts] = useState([])
	const [boughtNfts, setBoughtNfts] = useState([])

	const router = useRouter()

	let account

	const reSell = (tokenId) => {
		router.push({
			pathname: "/sellnft",
			query: { id: tokenId },
		})
	}

	// Gets data of NFTs bought from the marketplace
	const loadBoughtNFT = async () => {
		try {
			const { ethereum } = window

			if (ethereum) {
				const provider = await new ethers.providers.Web3Provider(
					ethereum
				)
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
						let price = ethers.utils.formatUnits(
							i.price.toString(),
							"ether"
						)

						let item = {
							price,
							tokenId: i.tokenId.toNumber(),
							name: meta.data.name,
							seller: i.seller,
							owner: i.owner,
							image: meta.data.image,
						}
						return item
					})
				)
				console.log("bought", data)
				setBoughtNfts(items)
			} else {
				console.log("Ethereum object doesn't exist!")
			}
		} catch (error) {
			console.log("Error loading NFT nft", error)
		}
	}

	useEffect(() => {
		loadBoughtNFT()
	}, [])

	return (
		<div className='flex flex-col justify-center items-center text-white'>
			<div className='flex justify-center'>
				<div className='px-4 mt-12'>
					<div className='text-center text-2xl font-extrabold'>
						Your NFT Items
					</div>
					{boughtNfts.length === 0 ? (
						<div className='text-lg text-center font-semibold mt-4'>
							No NFT items.
						</div>
					) : (
						<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 pt-4 mt-4'>
							{boughtNfts.map((boughtNft, i) => (
								<button
									key={i}
									onClick={() => reSell(boughtNft.tokenId)}
									className='bg-gray-900 shadow-md shadow-green-500 rounded-lg overflow-hidden w-72 h-80 hover:shadow-green-400 hover:shadow-lg hover:scale-[1.02] transition duration-500 ease-in-out'
								>
									<img
										src={boughtNft.image}
										className='w-full h-56 p-4'
									/>
									<div className='flex flex-col font-bold'>
										<div className='flex justify-between px-4'>
											<div>Id</div>
											<div>{boughtNft.tokenId}</div>
										</div>
										<div className='flex justify-between px-4'>
											<div>Name</div>
											<div>{boughtNft.name}</div>
										</div>
									</div>
								</button>
							))}
						</div>
					)}
				</div>
			</div>
		</div>
	)
}

export default profile
