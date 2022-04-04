require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { contract } = require('./abi');
const { keccak256 } = require('ethereum-cryptography/keccak');
const secp = require('@noble/secp256k1');
const { bytesToHex } = require('ethereum-cryptography/utils');
const objectHash = require('object-hash');
const { create } = require('ipfs-http-client');
const multer = require('multer');

const ipfs = create();
const upload = multer();

const PUBLIC_ADDRESS = process.env.PUBLIC_ADDRESS;

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

const verifySig = async (sign, hash, did) => {
	try {
		const didDoc = await contract.methods.getDid(did).call();
		const publicKey = didDoc[3].publicKey;
		const isValid = secp.verify(sign, hash, publicKey);
		return isValid;
	} catch (err) {
		console.log(err);
		return err;
	}
};

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

app.post('/sign', async (req, res) => {
	console.log(req.body);
	const signHash = await secp.sign(req.body.hash, req.body.privateKey, {
		canonical: true,
	});
	const sign = secp.Signature.fromDER(signHash);
	res.status(200).json({ sign: sign.toCompactHex() });
});

// DID APIs
app.get('/getDIDDoc/:did', async (req, res) => {
	const did = decodeURI(req.params.did);
	try {
		const didDoc = await contract.methods.getDid(did).call();
		console.log(didDoc);
		const key = {
			id: didDoc[3].id,
			owner: didDoc[3].owner,
			methodType: didDoc[3].methodType,
			publicKey: didDoc[3].publicKey,
		};
		res.status(200).json({
			context: didDoc[0],
			did: didDoc[1],
			name: didDoc[2],
			key: key,
		});
	} catch (err) {
		console.log(err);
		res.status(500).json({ error: err });
	}
});

app.get('/getName/:did', async (req, res) => {
	const did = decodeURI(req.params.did);
	try {
		const didDoc = await contract.methods.getDid(did).call();
		res.status(200).json({
			name: didDoc[2],
		});
	} catch (err) {
		console.log(err);
		res.status(500).json({ error: err });
	}
});

app.get('/importAccount/:did', async (req, res) => {
	const did = decodeURI(req.params.did);
	try {
		const recoveryHash = await contract.methods.getRecovery(did).call();
		console.log(recoveryHash);
		const stream = ipfs.cat(recoveryHash);
		let data = '';
		for await (const chunk of stream) {
			data += chunk.toString();
		}
		const dataObj = JSON.parse(data);
		res.status(200).json({
			data: dataObj,
		});
	} catch (err) {
		console.log(err);
		res.status(500).json({ error: err });
	}
});

app.post('/exportAccount', async (req, res) => {
	console.log(req.body);
	const { did, data } = req.body;
	try {
		const result = await ipfs.add(JSON.stringify(data));
		await contract.methods.setRecovery(did, result.path).send({
			from: PUBLIC_ADDRESS,
			gas: '1000000',
		});
		res.status(200).json({
			mssg: 'Recovery hash set',
		});
	} catch (err) {
		console.log(err);
		res.status(500).json({ error: err });
	}
});

app.post('/createDID', async (req, res) => {
	console.log(req.body);
	const { address, publicKey, name } = req.body;
	try {
		const did = await contract.methods
			.createDID(address, publicKey, name)
			.send({
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

// Credential APIs
app.post('/revokeAccess', async (req, res) => {
	const { credDID, ownerDID, hash, sign, receiverDID } = req.body;
	try {
		const isValid = await verifySig(sign, hash, ownerDID);
		if (!isValid) {
			res.status(403).json({ mssg: 'Invalid signature' });
			return;
		}
		const mssg = await contract.methods
			.revokeAccess(ownerDID, credDID, receiverDID)
			.send({
				from: PUBLIC_ADDRESS,
				gas: '1000000',
			});
		res.status(200).json({
			mssg: mssg.events.RevokeAccess.returnValues.mssg,
		});
	} catch (err) {
		console.log(err);
		res.status(500).json({ error: err });
	}
});

app.get('/getCredential', async (req, res) => {
	const credDID = req.query.credDID;
	const receiverDID = req.query.did;
	const hash = req.query.hash;
	const sign = req.query.sign;
	try {
		const isValid = await verifySig(sign, hash, receiverDID);
		if (!isValid) {
			res.status(403).json({ mssg: 'Invalid signature' });
			return;
		}
		const credential = await contract.methods
			.getCredential(credDID, receiverDID)
			.call();
		console.log(credential);
		const stream = ipfs.cat(credential[3]);
		let data = '';
		for await (const chunk of stream) {
			data += chunk.toString();
		}
		const dataObj = JSON.parse(data);
		res.status(200).json({
			did: credential[0],
			...dataObj,
		});
	} catch (error) {
		console.log(error);
		res.status(500).json({ error: error });
	}
});

app.post('/getCredential', async (req, res) => {
	const { credDID, ownerDID, hash, sign, receiverDID } = req.body;
	try {
		const isValid = await verifySig(sign, hash, ownerDID);
		if (!isValid) {
			res.status(403).json({ mssg: 'Invalid signature' });
			return;
		}
		console.log(ownerDID);
		await contract.methods.giveAccess(ownerDID, credDID, receiverDID).send({
			from: PUBLIC_ADDRESS,
			gas: '1000000',
		});
		const credential = await contract.methods
			.getCredential(credDID, receiverDID)
			.call();
		const stream = ipfs.cat(credential[3]);
		let data = '';
		for await (const chunk of stream) {
			data += chunk.toString();
		}
		const dataObj = JSON.parse(data);
		if (dataObj.ownerDID != ownerDID) {
			res.status(403).json({ mssg: 'Not the owner of the credential' });
			return;
		}
		res.status(200).json({
			did: credential[0],
			...dataObj,
		});
	} catch (err) {
		console.log(err);
		res.status(500).json({ error: err });
	}
});

app.post('/addCredential', async (req, res) => {
	console.log(req.body);
	const hash = objectHash(req.body);
	const { issuerDID, ownerDID, proof } = req.body;
	try {
		const isValid = await verifySig(proof.sign, proof.hash, issuerDID);
		if (!isValid) {
			res.status(403).json({ mssg: 'Invalid signature' });
			return;
		}
		const result = await ipfs.add(JSON.stringify(req.body));
		console.log(issuerDID, ownerDID);
		const did = await contract.methods
			.createCredential(ownerDID, issuerDID, hash, result.path)
			.send({ from: PUBLIC_ADDRESS, gas: '1000000' });
		res.status(200).json({
			did: did.events.CreateCredential.returnValues.did,
		});
	} catch (err) {
		console.log(err);
		res.status(500).json({ error: err });
	}
});

app.listen(8080, process.env.IP, () => {
	console.log(`Server started on ${process.env.IP}:8080`);
});
