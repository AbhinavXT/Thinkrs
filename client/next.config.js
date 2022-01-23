/** @type {import('next').NextConfig} */
require('dotenv').config()

module.exports = {
	reactStrictMode: true,
	env: {
		NFT_STORAGE_API_KEY: process.env.NFT_STORAGE_API_KEY,
	},
}
