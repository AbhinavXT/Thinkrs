import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

const Layout = ({ children }) => {
	return (
		<div className='bg-black flex flex-col justify-between min-h-screen min-w-fit'>
			<Navbar />
			{children}
			<Footer />
		</div>
	)
}

export default Layout
