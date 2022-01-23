import { useState, useCallback } from 'react'
import { NFTStorage, File } from 'nft.storage'

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

	const onSubmit = async () => {
		const metadata = await client.store({
			name: tag,
			description: description,
			image: new File([file], tag, { type: fileType }),
		})

		console.log(metadata)
	}

	return (
		<div className='flex justify-center max-h-screen'>
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

				<input type='file' name='Asset' className='my-4' onChange={onChange} />

				<button
					className='font-bold mt-4 bg-gray-800 text-white rounded p-4 shadow-lg'
					onClick={onSubmit}
				>
					Submit
				</button>
			</div>
		</div>
	)
}

export default create
