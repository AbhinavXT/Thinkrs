import { useState, useCallback } from "react"

import { create as ipfsHttpClient } from "ipfs-http-client"

import axios from "axios"
import { ethers } from "ethers"

import { nftContractAddress, nftMarketAddress } from "../config"
import NFT from "../utils/NFT.json"
import Market from "../utils/NFTMarket.json"

import { useRouter } from "next/router"

const client = ipfsHttpClient("https://ipfs.infura.io:5001/api/v0")

const create = () => {
	const [fileUrl, setFileUrl] = useState(null)
	const [name, setName] = useState(``)
	const [description, setDescription] = useState(``)
	const [price, setPrice] = useState(null)
	const [nftLoading, setNftLoading] = useState(null)

	const router = useRouter()

	let progress_func = function (len) {
		console.log("File progress:", len)
	}

	const onChange = useCallback(
		async (e) => {
			const file = e.target.files[0]
			try {
				const added = await client.add(file, {
					progress: progress_func,
					pin: true,
				})

				const url = `https://ipfs.infura.io/ipfs/${added.path}`
				setFileUrl(url)
			} catch (error) {
				console.log("Error uploading file: ", error)
			}
		},
		[fileUrl]
	)

	const onNameChange = useCallback(
		(e) => {
			setName(e.target.value)
		},
		[name]
	)

	const onDescriptionChange = useCallback(
		(e) => {
			setDescription(e.target.value)
		},
		[description]
	)

	const onPriceChange = useCallback(
		(e) => {
			setPrice(e.target.value)
		},
		[price]
	)

	const submit = async () => {
		setNftLoading(0)
		const data = JSON.stringify({
			name: name,
			description: description,
			image: fileUrl,
		})

		try {
			const added = await client.add(data)
			const url = `https://ipfs.infura.io/ipfs/${added.path}`

			mintNFT(url)
		} catch (error) {
			console.log("Error uploading file: ", error)
		}
	}

	const mintNFT = async (url) => {
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

				console.log(url)

				let nftTx = await nftContract.createNFT(url)
				console.log("Mining....", nftTx.hash)

				let tx = await nftTx.wait()

				let event = tx.events[0]
				let value = event.args[2]
				let tokenId = value.toNumber()

				// console.log('Token ID:', tokenId)

				// let tokenUri = await nftContract.tokenURI(tokenId)
				// console.log('Token URI:', tokenUri)
				console.log(
					`Mined, see transaction: https://rinkeby.etherscan.io/tx/${nftTx.hash}`
				)

				const itemPrice = ethers.utils.parseUnits(price, "ether")

				let listingPrice = await marketContract.getListingPrice()
				listingPrice = listingPrice.toString()

				let marketTx = await marketContract.createMarketItem(
					nftContractAddress,
					tokenId,
					itemPrice,
					{ value: listingPrice }
				)

				console.log("Mining....", marketTx.hash)

				tx = await marketTx.wait()

				console.log(
					`Mined, see transaction: https://rinkeby.etherscan.io/tx/${marketTx.hash}`
				)
				setNftLoading(1)

				router.push("/explore")
			} else {
				console.log("Ethereum object doesn't exist!", error.message)
			}
		} catch (error) {
			console.log("Error minting character", error)
		}
	}

	return (
		<div className='flex justify-center min-h-screen text-white'>
			<div className='w-3/4 lg:w-1/2 flex flex-col pb-12 mt-20'>
				<input
					placeholder='Name'
					className='mt-8 border rounded p-4 text-black font-bold'
					onChange={onNameChange}
				/>
				<input
					placeholder='Price'
					className='mt-2 border rounded p-4 text-black font-bold'
					onChange={onPriceChange}
				/>
				<textarea
					placeholder='Description'
					className='mt-2 h-32 border rounded p-4 text-black '
					onChange={onDescriptionChange}
				/>
				<div>
					<input
						type='file'
						name='Asset'
						className='my-4'
						onChange={onChange}
					/>
				</div>

				{fileUrl && (
					<img className='rounded mt-4' width='350' src={fileUrl} />
				)}

				<button
					className='font-bold mt-4 text-lg bg-gray-800 text-gray-200 rounded p-4 hover:shadow-lg hover:shadow-green-400 hover:scale-[1.01] transtion duration-500'
					onClick={submit}
				>
					Submit
				</button>

				{nftLoading === 0 ? (
					<div className='flex px-auto justify-center items-center font-bold mt-20'>
						Proocessing Your Transaction....
					</div>
				) : (
					<div></div>
				)}
			</div>
		</div>
	)
}

export default create
