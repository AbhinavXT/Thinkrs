import Link from 'next/link'

const Hero = () => {
	return (
		<div className='flex flex-col items-center gap-y-32 text-center px-40 gap-x-20 md:flex-row md:text-left'>
			<div className='flex flex-col gap-y-8 w-1/2'>
				<div className='font-extrabold text-5xl'>
					Trade NFTs of News Stories, Earn and Rewards
				</div>
				<div className='font-bold'>
					Lorem ipsum dolor sit amet, consectetur adipisicing elit. Voluptates
					totam vel exercitationem odio doloribus vero labore magnam suscipit.
					Delectus totam neque eveniet pariatur hic alias odio ullam doloremque
					quod quam? Numquam pariatur quam animi reprehenderit, alias culpa
					quisquam fugiat libero laudantium itaque dolor aliquid perspiciatis
					repudiandae odio sint quos iusto ad minima vero? Modi reiciendis
					labore expedita sapiente quisquam dolorem! Repudiandae, incidunt
					magnam! Suscipit, debitis tenetur? Possimus maiores nam minus qui
					excepturi fugit quasi distinctio ea?
				</div>
				<div className='flex gap-x-8 justify-center md:justify-start'>
					<Link href='/explore'>
						<button className='p-4 text-black font-bold rounded-lg bg-green-400 hover:scale-[1.03] transtion duration-500'>
							Explore NFTs
						</button>
					</Link>
					<Link href='/create'>
						<button className='p-4 font-bold rounded-lg bg-gray-900 hover:scale-[1.03] transtion duration-500'>
							List an NFT
						</button>
					</Link>
				</div>
			</div>
			<div className='flex flex-col gap-y-4 mx-40'>
				<div className='bg-gray-900 h-[415px] w-[380px] rounded-2xl shadow-green-400 shadow-lg hover:scale-[1.02] transtion duration-500'>
					<div className='p-4 flex justify-between'>
						<div className='flex items-center justify-center font-bold px-12 h-8 w-20 bg-gray-700 rounded-lg'>
							Trending
						</div>
						<div></div>
					</div>
					<div>
						<img src='/nft.png' alt='Trending nft' />
					</div>
					<div className='flex items-center font-bold p-4'>Doodole #6961</div>
				</div>
			</div>
		</div>
	)
}

export default Hero
