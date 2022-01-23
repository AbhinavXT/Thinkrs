import Head from 'next/head'
import Hero from '../components/Hero'
import TopCollections from '../components/TopCollections'
import Explore from '../components/Explore'

export default function Home() {
	return (
		<div className='flex flex-col mt-40 min-h-screen text-gray-200'>
			<Head>
				<title>Create Next App</title>
				<link rel='icon' href='/favicon.ico' />
			</Head>
			<Hero />
			<TopCollections />
			<Explore />
		</div>
	)
}
