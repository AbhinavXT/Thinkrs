import Link from "next/link"

const Hero = () => {
	return (
		<div className='flex flex-col items-center gap-y-32 text-center px-40 lg:gap-x-20 lg:flex-row lg:text-left'>
			<div className='flex flex-col gap-y-8 lg:w-1/2'>
				<div className='font-extrabold text-[40px] lg:text-5xl'>
					Trade NFTs of News Stories, Earn and Rewards
				</div>
				<div className='text-xl px-12 lg:text-lg lg:px-0'>
					Thinkrs is the first media NFT Marketplace which allows you
					to make money trading news stories.{" "}
					<span className='hidden lg:inline'>
						Thinkrs is the first media NFT Marketplace which allows
						you to make money trading news stories. By Minting under
						covered stories or topics and selliing it if you think
						it will gain prominance or should be discovered. You
						earn rewards with each trade. Make money while ensuring
						the most important storiesre shown to public.
					</span>
				</div>
				<div className='flex gap-x-8 justify-center lg:justify-start'>
					<Link href='/explore'>
						<button className='p-4 text-black font-bold rounded-lg bg-green-400 hover:scale-[1.03] transtion duration-500 text-xl lg:text-lg'>
							Explore NFTs
						</button>
					</Link>
					<Link href='/create'>
						<button className='p-4 font-bold rounded-lg bg-gray-900 hover:scale-[1.03] transtion duration-500 text-xl lg:text-lg'>
							List an NFT
						</button>
					</Link>
				</div>
			</div>
			<div className='flex flex-col gap-y-4 mx-40'>
				<div className='bg-gray-900 h-[390px] w-[350px] lg:h-[415px] lg:w-[380px] rounded-2xl shadow-green-400 shadow-lg hover:scale-[1.02] transtion duration-500'>
					<div className='p-4 flex justify-between'>
						<div className='flex items-center justify-center font-bold px-12 h-8 w-20 bg-gray-700 rounded-lg'>
							Trending
						</div>
						<div></div>
					</div>
					<div>
						<img src='/nft.png' alt='Trending nft' />
					</div>
					<div className='flex items-center font-bold p-4'>
						Doodole #6961
					</div>
				</div>
			</div>
		</div>
	)
}

export default Hero
