import Head from 'next/head'
import Hero from '../components/Hero'

export default function Home() {
	return (
		<div className='flex flex-col mt-40 min-h-screen text-gray-200'>
			<Head>
				<title>Create Next App</title>
				<link rel='icon' href='/favicon.ico' />
			</Head>
			<Hero />
		</div>
	)
}
