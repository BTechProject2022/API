## How to start api server
- cd into the folder and run `npm install`
- Copy the solidity file from [here](https://github.com/BTechProject2022/Solidity/blob/main/CredentialSchema.sol) to remix
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
    - POST request with address and publicKey in body
	- Returns did
2. Get DID Document `/getDIDDoc/:did`:
    - GET request with did as query param
	- Returns object with context, did, and public key
3. Get Key Pair `/keyPair`:
    - GET request
    - Returns object with ethereum address, private key, and public key
4. Create Credential Schema `/createSchema`:
    - POST request with issuerDID, name, description, and properties in the form of array of objects in body
    - Returns did
5. Get Credential Schema `/getSchema/:did`:
    - GET request with did as query param
    - Returns object with context, did, name, description, and properties in the form of array of objects
