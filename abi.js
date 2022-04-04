require('dotenv').config();
const Web3 = require('web3');
const contractAbi = [
	{
		anonymous: false,
		inputs: [
			{
				indexed: false,
				internalType: 'string',
				name: 'did',
				type: 'string',
			},
		],
		name: 'CreateCredSchema',
		type: 'event',
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: false,
				internalType: 'string',
				name: 'did',
				type: 'string',
			},
		],
		name: 'CreateCredential',
		type: 'event',
	},
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
						internalType: 'string',
						name: 'ipfsHash',
						type: 'string',
					},
				],
				indexed: false,
				internalType: 'struct CredentialSchema.CredSchema',
				name: 'credSchema',
				type: 'tuple',
			},
		],
		name: 'GetCredSchema',
		type: 'event',
	},
	{
		anonymous: false,
		inputs: [
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
						name: 'issuer',
						type: 'string',
					},
					{
						internalType: 'string',
						name: 'ipfsHash',
						type: 'string',
					},
				],
				indexed: false,
				internalType: 'struct CredContract.Credential',
				name: 'credential',
				type: 'tuple',
			},
		],
		name: 'GetCredential',
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
						internalType: 'string',
						name: 'name',
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
					{
						internalType: 'string',
						name: 'recovery',
						type: 'string',
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
		anonymous: false,
		inputs: [
			{
				indexed: false,
				internalType: 'string',
				name: 'mssg',
				type: 'string',
			},
		],
		name: 'GiveAccess',
		type: 'event',
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: false,
				internalType: 'string',
				name: 'mssg',
				type: 'string',
			},
		],
		name: 'RevokeAccess',
		type: 'event',
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: false,
				internalType: 'string',
				name: 'mssg',
				type: 'string',
			},
		],
		name: 'SendMessage',
		type: 'event',
	},
	{
		inputs: [
			{
				internalType: 'string',
				name: 'issuerDid',
				type: 'string',
			},
			{
				internalType: 'string',
				name: 'hash',
				type: 'string',
			},
			{
				internalType: 'string',
				name: 'ipfsHash',
				type: 'string',
			},
		],
		name: 'createCredSchema',
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
				name: 'ownerDID',
				type: 'string',
			},
			{
				internalType: 'string',
				name: 'issuerDID',
				type: 'string',
			},
			{
				internalType: 'string',
				name: 'hash',
				type: 'string',
			},
			{
				internalType: 'string',
				name: 'ipfsHash',
				type: 'string',
			},
		],
		name: 'createCredential',
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
				name: 'addr',
				type: 'string',
			},
			{
				internalType: 'string',
				name: 'pubKey',
				type: 'string',
			},
			{
				internalType: 'string',
				name: 'name',
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
		name: 'credSchemaStore',
		outputs: [
			{
				internalType: 'string',
				name: 'id',
				type: 'string',
			},
			{
				internalType: 'string',
				name: 'ipfsHash',
				type: 'string',
			},
		],
		stateMutability: 'view',
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
				internalType: 'string',
				name: 'name',
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
			{
				internalType: 'string',
				name: 'recovery',
				type: 'string',
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
		name: 'getCredSchema',
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
						internalType: 'string',
						name: 'ipfsHash',
						type: 'string',
					},
				],
				internalType: 'struct CredentialSchema.CredSchema',
				name: '',
				type: 'tuple',
			},
		],
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		inputs: [
			{
				internalType: 'string',
				name: 'did',
				type: 'string',
			},
			{
				internalType: 'string',
				name: 'receiverDID',
				type: 'string',
			},
		],
		name: 'getCredential',
		outputs: [
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
						name: 'issuer',
						type: 'string',
					},
					{
						internalType: 'string',
						name: 'ipfsHash',
						type: 'string',
					},
				],
				internalType: 'struct CredContract.Credential',
				name: '',
				type: 'tuple',
			},
		],
		stateMutability: 'nonpayable',
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
						internalType: 'string',
						name: 'name',
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
					{
						internalType: 'string',
						name: 'recovery',
						type: 'string',
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
	{
		inputs: [
			{
				internalType: 'string',
				name: 'did',
				type: 'string',
			},
		],
		name: 'getRecovery',
		outputs: [
			{
				internalType: 'string',
				name: '',
				type: 'string',
			},
		],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [
			{
				internalType: 'string',
				name: 'ownerDID',
				type: 'string',
			},
			{
				internalType: 'string',
				name: 'credDID',
				type: 'string',
			},
			{
				internalType: 'string',
				name: 'receiverDID',
				type: 'string',
			},
		],
		name: 'giveAccess',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		inputs: [
			{
				internalType: 'string',
				name: 'ownerDID',
				type: 'string',
			},
			{
				internalType: 'string',
				name: 'credDID',
				type: 'string',
			},
			{
				internalType: 'string',
				name: 'receiverDID',
				type: 'string',
			},
		],
		name: 'revokeAccess',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		inputs: [
			{
				internalType: 'string',
				name: 'did',
				type: 'string',
			},
			{
				internalType: 'string',
				name: 'recovery',
				type: 'string',
			},
		],
		name: 'setRecovery',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function',
	},
];

const web3 = new Web3();
web3.setProvider(
	new web3.providers.WebsocketProvider(process.env.PROVIDER_URL)
);

const contract = new web3.eth.Contract(
	contractAbi,
	process.env.CONTRACT_ADDRESS
);

module.exports = { contract };
