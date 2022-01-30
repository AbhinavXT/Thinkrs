import 'tailwindcss/tailwind.css'
import Layout from '../components/Layout'

function MyApp({ Component, pageProps }) {
	return (
		<div className='bg-black min-h-screen min-w-fit'>
			<Layout>
				<Component {...pageProps} />
			</Layout>
		</div>
	)
}

export default MyApp
