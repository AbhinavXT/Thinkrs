import { useState, useEffect, useCallback } from "react"
import { ethers } from "ethers"
import axios from "axios"

import { nftContractAddress, nftMarketAddress } from "../config.js"

import NFT from "../../artifacts/contracts/NFT.sol/NFT.json"
import Market from "../../artifacts/contracts/NFTMarket.sol/NFTMarket.json"

import { useRouter } from "next/router"

const sellnft = () => {
	const [price, setPrice] = useState("")
	const [nft, setNft] = useState({})
	const [id, setId] = useState(null)
	const [owner, setOwner] = useState("")

	const router = useRouter()

	const handleChange = useCallback(
		(e) => {
			setPrice(e.target.value)
		},
		[setPrice]
	)

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

				const tokenId = router.query.id
				setId(tokenId)

				const tokenOwner = await nftContract.ownerOf(tokenId)
				setOwner(tokenOwner)

				const itemData = await nftContract.tokenURI(tokenId)
				const data = await axios.get(itemData)

				setNft(data.data)
			} else {
				console.log("Ethereum object doesn't exist!")
			}
		} catch (error) {
			console.log("Error fetching token data", error)
		}
	}

	const reSellItem = async () => {
		try {
			const { ethereum } = window

			if (ethereum) {
				const provider = new ethers.providers.Web3Provider(ethereum)
				const signer = provider.getSigner()
				const marketContract = new ethers.Contract(
					nftMarketAddress,
					Market.abi,
					signer
				)

				const tokenId = router.query.id

				let listingPrice = await marketContract.getListingPrice()
				listingPrice = listingPrice.toString()

				const itemPrice = ethers.utils.parseUnits(price, "ether")

				let tx = await marketContract.resellNftItem(
					nftContractAddress,
					tokenId,
					itemPrice,
					{ value: listingPrice }
				)
				console.log("Mining:", tx.hash)
				await tx.wait()

				console.log("Mined!", tx.hash)

				router.push("/explore")
			} else {
				console.log("Ethereum object doesn't exist!")
			}
		} catch (error) {
			console.log("Error minting character", error)
		}
	}

	useEffect(() => {
		if (!router.isReady) return
		getNFTData()
	}, [router.isReady])

	return (
		<div className='flex px-60 pt-20 gap-x-20 text-gray-300'>
			<div className='flex flex-col w-3/6 gap-y-6'>
				<div className='flex justify-center items-center h-96 w-full'>
					<img
						src={nft.image}
						alt=''
						className='h-80 rounded-xl shadow-xl'
					/>
				</div>
				<div>
					<div className='flex font-bold justify-center items-center text-black bg-gray-300  h-16 w-full text-lg rounded-lg shadow-lg'>
						{nft.description}
					</div>
				</div>
				<div>
					<div className='flex flex-col gap-y-2 w-full text-black bg-gray-300  px-4 py-4 font-bold rounded-lg shadow-lg'>
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
					<div>Owner:</div>
					<div className='text-gray-200'>{owner}</div>
				</div>
				<div className='flex gap-x-4 text-xl'>
					<div>Contract Address:</div>
					<div className='text-gray-200'>{nftContractAddress}</div>
				</div>
				<div className='flex flex-col gap-y-4 w-96'>
					<input
						type='text'
						onChange={handleChange}
						name='name'
						placeholder='NFT Price'
						className='h-12 rounded-lg shadow-lg px-4 font-bold text-black bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-800 focus:border-transparent'
					/>
					<button
						onClick={reSellItem}
						className='flex justify-center items-center h-12 rounded-lg shadow-lg bg-green-400 text-black font-bold text-lg cursor-pointer hover:shadow-lg hover:scale-[1.03] transition duration-500 ease-in-out'
					>
						Sell
					</button>
				</div>
			</div>
		</div>
	)
}

export default sellnft
