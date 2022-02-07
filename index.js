require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { didContract, web3 } = require('./abi');

const PUBLIC_ADDRESS = process.env.PUBLIC_ADDRESS;

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

app.get('/getDIDDoc/:did', async (req, res) => {
	const did = decodeURI(req.params.did);
	try {
		const didDoc = await didContract.methods.getDid(did).call();
		console.log(didDoc);
		const key = {
			id: didDoc[2].id,
			owner: didDoc[2].owner,
			methodType: didDoc[2].methodType,
			publicKey: didDoc[2].publicKey
		}
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
	const account = await web3.eth.getAccounts()[0];
	// blockchainTransactionsQueue.push(
	// 	didContract.methods.createDID(address, publicKey).encodeABI()
	// );
	try {
		const did = await didContract.methods
			.createDID(address, publicKey)
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

app.listen(8080, () => {
	console.log('Server started on localhost:8080');
});
