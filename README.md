## How to start api server
- cd into the folder and run `npm install`
- Copy the solidity file from [here](https://github.com/BTechProject2022/Solidity/blob/main/DIDFinal.sol) to remix
- Compile the file
- Before deploying change enviroment to web3 provider and add the url as `ws://127.0.0.1:7545`
- Deploy contract and copy the contract address
- Create a .env file and add
  - Public Address of the account from ganache
  - Provider URL as `ws://127.0.0.1:7545`
  - Address of the deployed contract
- Run npm run dev to start server in development

## 2 APIs
1. Create DID `/createDID`:
    - POST request address and publicKey in body
	- Returns did
2. Get DID Document `/getDIDDoc/:did`:
    - GET request with did as query param
	- Returns object with context, did, and public key
2. Get Key Pair `/keyPait`:
    - GET request
    - Returns object with ethereum address, private key, and public key
