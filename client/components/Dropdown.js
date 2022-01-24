import Link from 'next/link'

const Dropdown = () => {
	return (
		<div className='flex flex-col items-center divide-y-2 divide-gray-400 rounded-lg text-lg shadow-md shadow-green-400'>
			<div className='w-full px-12 py-4 cursor-pointer hover:shadow-md hover:shadow-slate-400'>
				<Link href='/'>
					<button className='flex items-center gap-x-4'>
						<svg
							xmlns='http://www.w3.org/2000/svg'
							width='20'
							height='20'
							fill='currentColor'
							className='bi bi-person-circle'
							viewBox='0 0 16 16'
						>
							<path d='M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0z' />
							<path
								fill-rule='evenodd'
								d='M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1z'
							/>
						</svg>
						<div>Profile</div>
					</button>
				</Link>
			</div>
			<div className='w-full px-12 py-4 cursor-pointer hover:shadow-md hover:shadow-slate-400'>
				<Link href='/'>
					<button className='flex items-center gap-x-4'>
						<svg
							xmlns='http://www.w3.org/2000/svg'
							width='20'
							height='20'
							fill='currentColor'
							className='bi bi-grid-3x3-gap'
							viewBox='0 0 16 16'
						>
							<path d='M4 2v2H2V2h2zm1 12v-2a1 1 0 0 0-1-1H2a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1zm0-5V7a1 1 0 0 0-1-1H2a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1zm0-5V2a1 1 0 0 0-1-1H2a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1zm5 10v-2a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1zm0-5V7a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1zm0-5V2a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1zM9 2v2H7V2h2zm5 0v2h-2V2h2zM4 7v2H2V7h2zm5 0v2H7V7h2zm5 0h-2v2h2V7zM4 12v2H2v-2h2zm5 0v2H7v-2h2zm5 0v2h-2v-2h2zM12 1a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1h-2zm-1 6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1V7zm1 4a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1h-2z' />
						</svg>
						<div>My Collections</div>
					</button>
				</Link>
			</div>
			<div className='w-full px-12 py-4 cursor-pointer hover:shadow-md hover:shadow-slate-400'>
				<Link href='/'>
					<button className='flex items-center gap-x-4'>
						<svg
							xmlns='http://www.w3.org/2000/svg'
							width='20'
							height='20'
							fill='currentColor'
							className='bi bi-box-arrow-right'
							viewBox='0 0 16 16'
						>
							<path
								fill-rule='evenodd'
								d='M10 12.5a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v2a.5.5 0 0 0 1 0v-2A1.5 1.5 0 0 0 9.5 2h-8A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h8a1.5 1.5 0 0 0 1.5-1.5v-2a.5.5 0 0 0-1 0v2z'
							/>
							<path
								fill-rule='evenodd'
								d='M15.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 0 0-.708.708L14.293 7.5H5.5a.5.5 0 0 0 0 1h8.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3z'
							/>
						</svg>
						<div>Logout</div>
					</button>
				</Link>
			</div>
		</div>
	)
}

export default Dropdown
