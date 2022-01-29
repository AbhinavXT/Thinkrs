const { assert } = require('chai')

describe('NFT Contract', async () => {
	let nft
	let market
	let marketContractAddress
	let nftContractAddress
	let tokenId

	// Deploys the NFT contract and the Market contract before each test
	beforeEach('Setup Contract', async () => {
		const Market = await ethers.getContractFactory('NFTMarket')
		market = await Market.deploy()
		await market.deployed()
		marketContractAddress = await market.address

		const NFT = await ethers.getContractFactory('NFT')
		nft = await NFT.deploy(marketContractAddress)
		await nft.deployed()
		nftContractAddress = await nft.address
	})

	// Tests address for the NFT contract
	it('Should have an address', async () => {
		assert.notEqual(nftContractAddress, 0x0)
		assert.notEqual(nftContractAddress, '')
		assert.notEqual(nftContractAddress, null)
		assert.notEqual(nftContractAddress, undefined)
	})

	// Tests name for the token of NFT contract
	it('Should have a name', async () => {
		// Returns the name of the token
		const name = await nft.collectionName()

		assert.equal(name, 'Thinkrs NFT')
	})

	// Tests symbol for the token of NFT contract
	it('Should have a symbol', async () => {
		// Returns the symbol of the token
		const symbol = await nft.collectionSymbol()

		assert.equal(symbol, 'THINK')
	})

	// Tests for NFT minting function of NFT contract using tokenID of the minted NFT
	it('Should be able to mint NFT', async () => {
		// Mints a NFT
		let txn = await nft.createNFT('https://www.mytokenlocation1.com')
		let tx = await txn.wait()

		// tokenID of the minted NFT
		let event = tx.events[0]
		let value = event.args[2]
		tokenId = value.toNumber()

		assert.equal(tokenId, 0)

		// Mints another NFT
		txn = await nft.createNFT('https://www.mytokenlocation2.com')
		tx = await txn.wait()

		// tokenID of the minted NFT
		event = tx.events[0]
		value = event.args[2]
		tokenId = value.toNumber()

		assert.equal(tokenId, 1)
	})
})

describe('NFTMarket Contract', function () {
	let nft
	let market
	let marketContractAddress
	let nftContractAddress
	let listingPrice
	let auctionPrice

	// Deploys the NFT contract and the Market contract before each test
	beforeEach(' Marketplace', async () => {
		const Market = await ethers.getContractFactory('NFTMarket')
		market = await Market.deploy()
		await market.deployed()
		marketContractAddress = await market.address

		const NFT = await ethers.getContractFactory('NFT')
		nft = await NFT.deploy(marketContractAddress)
		await nft.deployed()
		nftContractAddress = await nft.address

		listingPrice = await market.getListingPrice()
		listingPrice = listingPrice.toString()

		auctionPrice = ethers.utils.parseUnits('1', 'ether')
	})

	// Test for creation of an  Marketplace item
	it('Should be able to create an  Item', async () => {
		// Mints a NFT
		await nft.createNFT('https://www.mytokenlocation.com')

		// Puts the NFT up for sale in the  marketplace
		await market.createMarketItem(nftContractAddress, 0, auctionPrice, {
			value: listingPrice,
		})

		// Fetches the remaining unsold marketplace items
		let items = await market.fetchNftItems()

		assert.equal(items.length, 1)
	})

	// Test for creation and sale of an  Marketplace item
	it('Should be able to execute  Item Sale', async () => {
		// Mints 2 NFTs
		await nft.createNFT('https://www.mytokenlocation1.com')
		await nft.createNFT('https://www.mytokenlocation2.com')

		// Puts the first NFT up for sale in the  marketplace
		await market.createMarketItem(nftContractAddress, 0, auctionPrice, {
			value: listingPrice,
		})

		// Puts the second NFT up for sale in the  marketplace
		await market.createMarketItem(nftContractAddress, 1, auctionPrice, {
			value: listingPrice,
		})

		const [_, buyerAddress] = await ethers.getSigners()

		// Creates a sale for the first NFT and transfers it from the owner to the buyer through the marketplace contract
		await market
			.connect(buyerAddress)
			.createNftItemSale(nftContractAddress, 1, { value: auctionPrice })

		// Fetches the remaining unsold marketplace items
		// Returns one as one of the two NFT minted is sold
		let items = await market.fetchNftItems()

		assert.equal(items.length, 1)
	})

	// Test for fetchng details of an  Marketplace item using its itemId
	it('Should be able to get an  item by its tokenId', async () => {
		// Mints 2 NFTs
		await nft.createNFT('https://www.mytokenlocation1.com')
		await nft.createNFT('https://www.mytokenlocation2.com')

		// Puts the first NFT up for sale in the  marketplace
		await market.createMarketItem(nftContractAddress, 0, auctionPrice, {
			value: listingPrice,
		})

		// Puts the second NFT up for sale in the  marketplace
		await market.createMarketItem(nftContractAddress, 1, auctionPrice, {
			value: listingPrice,
		})

		// Fetches the details of first marketplace item by its itemId
		let item = await market.fetchNftItemById(1)

		assert.equal(item.itemId, 1)
	})

	// Test for fetchng details of all created  Marketplace items
	it('Should be able to get an  item by its tokenId', async () => {
		// Mints 2 NFTs
		await nft.createNFT('https://www.mytokenlocation1.com')
		await nft.createNFT('https://www.mytokenlocation2.com')

		// Puts the first NFT up for sale in the  marketplace
		await market.createMarketItem(nftContractAddress, 0, auctionPrice, {
			value: listingPrice,
		})

		// Puts the second NFT up for sale in the  marketplace
		await market.createMarketItem(nftContractAddress, 1, auctionPrice, {
			value: listingPrice,
		})

		// Fetches the details of all unsold marketplace items
		// Returs 2 as two items are created and none is sold
		let item = await market.fetchNftItems()

		assert.equal(item.length, 2)
	})

	// Test for fetchng details of all of items created by user
	it('Should be get an item created by owner', async () => {
		// Mints 2 NFTs
		await nft.createNFT('https://www.mytokenlocation1.com')
		await nft.createNFT('https://www.mytokenlocation2.com')

		// Puts the first NFT up for sale in the  marketplace
		await market.createMarketItem(nftContractAddress, 0, auctionPrice, {
			value: listingPrice,
		})

		// Puts the second NFT up for sale in the  marketplace
		await market.createMarketItem(nftContractAddress, 1, auctionPrice, {
			value: listingPrice,
		})

		// Fetches the details of all unsold marketplace items
		// Returs 2 as two items are created and none is sold
		let item = await market.fetchNftItemsCreated()

		console.log(item)
		assert.equal(item.length, 2)
	})
})
