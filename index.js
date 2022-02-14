require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { contract, web3 } = require('./abi');
const { keccak256 } = require('ethereum-cryptography/keccak');
const secp = require('@noble/secp256k1');
const { bytesToHex } = require('ethereum-cryptography/utils');
const objectHash = require('object-hash');
const { create } = require('ipfs-http-client');

const ipfs = create();

const PUBLIC_ADDRESS = process.env.PUBLIC_ADDRESS;

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

// Key pair API
app.get('/keyPair', async (req, res) => {
	// const did = decodeURI(req.params.did);
	console.log('here');
	const privateKeyBytes = secp.utils.randomPrivateKey();
	const privateKey = secp.utils.bytesToHex(privateKeyBytes);
	const publicKeyBytes = secp.getPublicKey(privateKeyBytes);
	const publicKey = secp.utils.bytesToHex(publicKeyBytes);
	const add = bytesToHex(keccak256(publicKeyBytes));
	const address = '0x' + add.substring(24);

	try {
		res.status(200).json({
			PrivateKey: privateKey,
			PublicKey: publicKey,
			Address: address,
		});
	} catch (err) {
		console.log(err);
		res.status(500).json({ error: err });
	}
});

// DID APIs
app.get('/getDIDDoc/:did', async (req, res) => {
	const did = decodeURI(req.params.did);
	try {
		const didDoc = await contract.methods.getDid(did).call();
		console.log(didDoc);
		const key = {
			id: didDoc[2].id,
			owner: didDoc[2].owner,
			methodType: didDoc[2].methodType,
			publicKey: didDoc[2].publicKey,
		};
		res.status(200).json({ context: didDoc[0], did: didDoc[1], key: key });
	} catch (err) {
		console.log(err);
		res.status(500).json({ error: err });
	}
});

app.post('/createDID', async (req, res) => {
	console.log(req.body);
	const address = req.body.address;
	const publicKey = req.body.publicKey;
	try {
		const did = await contract.methods.createDID(address, publicKey).send({
			from: PUBLIC_ADDRESS,
			gas: '1000000',
		});
		res.status(200).json({
			did: did.events.CreateDidEvent.returnValues.id,
		});
	} catch (err) {
		console.log(err);
		res.status(500).json({ error: err });
	}
});

// Credential Schema APIs
app.get('/getSchema/:did', async (req, res) => {
	const did = decodeURI(req.params.did);
	try {
		const credSchema = await contract.methods.getCredSchema(did).call();
		const stream = ipfs.cat(credSchema[2]);
		let data = '';
		for await (const chunk of stream) {
			data += chunk.toString();
		}
		const dataObj = JSON.parse(data);
		res.status(200).json({
			context: credSchema[0],
			did: credSchema[1],
			...dataObj,
		});
	} catch (err) {
		console.log(err);
		res.status(500).json({ error: err });
	}
});

app.post('/createSchema', async (req, res) => {
	console.log(req.body);
	const hash = objectHash(req.body);
	const { issuerDID } = req.body;
	try {
		const result = await ipfs.add(JSON.stringify(req.body));
		const did = await contract.methods
			.createCredSchema(issuerDID, hash, result.path)
			.send({ from: PUBLIC_ADDRESS, gas: '1000000' });
		res.status(200).json({
			did: did.events.CreateCredSchema.returnValues.did,
		});
	} catch (err) {
		console.log(err);
		res.status(500).json({ error: err });
	}
});

app.listen(8080, () => {
	console.log('Server started on localhost:8080');
});
