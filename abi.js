require('dotenv').config();
const Web3 = require('web3');
const didContractAbi = [
	{
		anonymous: false,
		inputs: [
			{
				indexed: false,
				internalType: 'string',
				name: 'id',
				type: 'string',
			},
		],
		name: 'CreateDidEvent',
		type: 'event',
	},
	{
		anonymous: false,
		inputs: [
			{
				components: [
					{
						internalType: 'string[]',
						name: 'context',
						type: 'string[]',
					},
					{
						internalType: 'string',
						name: 'id',
						type: 'string',
					},
					{
						components: [
							{
								internalType: 'string',
								name: 'id',
								type: 'string',
							},
							{
								internalType: 'string',
								name: 'owner',
								type: 'string',
							},
							{
								internalType: 'string',
								name: 'methodType',
								type: 'string',
							},
							{
								internalType: 'string',
								name: 'publicKey',
								type: 'string',
							},
						],
						internalType: 'struct DIDContract.PublicKey',
						name: 'publicKey',
						type: 'tuple',
					},
				],
				indexed: false,
				internalType: 'struct DIDContract.DIDDocument',
				name: 'did',
				type: 'tuple',
			},
		],
		name: 'GetDidEvent',
		type: 'event',
	},
	{
		inputs: [
			{
				internalType: 'string',
				name: 'addr',
				type: 'string',
			},
			{
				internalType: 'string',
				name: 'pubKey',
				type: 'string',
			},
		],
		name: 'createDID',
		outputs: [
			{
				internalType: 'string',
				name: '',
				type: 'string',
			},
		],
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		inputs: [
			{
				internalType: 'string',
				name: '',
				type: 'string',
			},
		],
		name: 'didStore',
		outputs: [
			{
				internalType: 'string',
				name: 'id',
				type: 'string',
			},
			{
				components: [
					{
						internalType: 'string',
						name: 'id',
						type: 'string',
					},
					{
						internalType: 'string',
						name: 'owner',
						type: 'string',
					},
					{
						internalType: 'string',
						name: 'methodType',
						type: 'string',
					},
					{
						internalType: 'string',
						name: 'publicKey',
						type: 'string',
					},
				],
				internalType: 'struct DIDContract.PublicKey',
				name: 'publicKey',
				type: 'tuple',
			},
		],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [
			{
				internalType: 'string',
				name: 'did',
				type: 'string',
			},
		],
		name: 'getDid',
		outputs: [
			{
				components: [
					{
						internalType: 'string[]',
						name: 'context',
						type: 'string[]',
					},
					{
						internalType: 'string',
						name: 'id',
						type: 'string',
					},
					{
						components: [
							{
								internalType: 'string',
								name: 'id',
								type: 'string',
							},
							{
								internalType: 'string',
								name: 'owner',
								type: 'string',
							},
							{
								internalType: 'string',
								name: 'methodType',
								type: 'string',
							},
							{
								internalType: 'string',
								name: 'publicKey',
								type: 'string',
							},
						],
						internalType: 'struct DIDContract.PublicKey',
						name: 'publicKey',
						type: 'tuple',
					},
				],
				internalType: 'struct DIDContract.DIDDocument',
				name: '',
				type: 'tuple',
			},
		],
		stateMutability: 'nonpayable',
		type: 'function',
	},
];

const web3 = new Web3();
web3.setProvider(
	new web3.providers.WebsocketProvider(process.env.PROVIDER_URL)
);

const didContract = new web3.eth.Contract(
	didContractAbi,
	process.env.CONTRACT_ADDRESS
);

module.exports = { didContract, web3 };
