import { useState, useCallback } from 'react'
import { NFTStorage, File } from 'nft.storage'

import axios from 'axios'
import { ethers } from 'ethers'

import { nftContractAddress } from '../config'
import NFT from '../utils/NFT.json'

const API_KEY = process.env.NFT_STORAGE_API_KEY

const client = new NFTStorage({ token: API_KEY })

const create = () => {
	const [file, setFile] = useState(``)
	const [fileType, setFileType] = useState(``)
	const [tag, setTag] = useState(``)
	const [description, setDescription] = useState(``)

	const onChange = useCallback(
		async (e) => {
			const file = e.target.files[0]

			setFileType(e.target.files[0].type)

			setFile(file)
		},
		[file]
	)

	const onTagChange = useCallback(
		(e) => {
			setTag(e.target.value)
		},
		[tag]
	)

	const onDescriptionChange = useCallback(
		(e) => {
			setDescription(e.target.value)
		},
		[description]
	)

	const ipfsUrl = (url) => {
		return `https://ipfs.io/ipfs/` + url
	}

	const onSubmit = async () => {
		const metadata = await client.store({
			name: tag,
			description: description,
			image: new File([file], tag, { type: fileType }),
		})

		console.log(metadata.url)

		//metadata && mintNFT(metadata)
		const fileCid = metadata.url.slice(7)
		const url = ipfsUrl(fileCid)
		console.log(url)

		url && mintNFT(url)
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

				const res = await axios.get(url)
				//console.log(res)

				const image = await axios.get(res.data.image)

				console.log(image)

				// let nftTx = await nftContract.createToken(image)
				// console.log('Mining....', nftTx.hash)

				// let tx = await nftTx.wait()

				// let event = tx.events[0]
				// let value = event.args[2]
				// let tokenId = value.toNumber()

				// console.log('Token ID:', tokenId)

				// let tokenUri = await nftContract.tokenURI(tokenId)
				// console.log('Token URI:', tokenUri)

				// console.log(
				// 	`Mined, see transaction: https://rinkeby.etherscan.io/tx/${nftTx.hash}`
				// )
			} else {
				console.log("Ethereum object doesn't exist!", error.message)
			}
		} catch (error) {
			console.log('Error minting character', error)
		}
	}

	return (
		<div className='flex justify-center max-h-screen mb-[280px] text-white'>
			<div className='w-1/2 flex flex-col pb-12 mt-20'>
				<input
					placeholder='Name'
					className='mt-8 border rounded p-4 text-black font-bold'
					onChange={onTagChange}
				/>
				<input
					placeholder='Description'
					className='mt-2 border rounded p-4 text-black font-bold'
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

				<button
					className='font-bold mt-4 text-lg bg-gray-800 text-gray-200 rounded p-4 hover:shadow-lg hover:shadow-green-400 hover:scale-[1.01] transtion duration-500'
					onClick={onSubmit}
				>
					Submit
				</button>
			</div>
		</div>
	)
}

export default create
