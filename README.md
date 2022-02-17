## How to start api server
- cd into the folder and run `npm install`
- Copy the solidity file from [here](https://github.com/BTechProject2022/Solidity/blob/main/Credential.sol) to remix
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
6. Sign hash using Private key `/sign`:
    - POST request with hash and private key in request body
    - Returns string which is signed value of hash from the private key
7. Add Credential `/addCredential`:
    - POST request with issuerDID, ownerDID, properties array which contains user's data, and proof in request body
    - proof object consists of hash and the signed value of the hash
    - If the sign is valid then returns did of the newly created Credential
8. Get Credential `/getCredential`:
    - POST request with credDID, ownerDID, hash, and signed value of the hash in request body
    - If the sign is valid then Credential is returned
    - TODO: If access control is added then did of the receiver will also be needed but not for now.
