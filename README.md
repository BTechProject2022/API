## How to start api server

-   cd into the folder and run `npm install`
-   Copy the solidity file from
    [here](https://github.com/BTechProject2022/Solidity/blob/main/Credential.sol)
    to remix
-   Compile the file
-   Before deploying change enviroment to web3 provider and add the url as
    `ws://127.0.0.1:7545`
-   Deploy contract and copy the contract address
-   Create a .env file and add
    -   Public Address of the account from ganache
    -   Provider URL as `ws://127.0.0.1:7545`
    -   Address of the deployed contract
-   Run npm run dev to start server in development

## 2 APIs

1. Create DID `/createDID`:
    - POST request with address and publicKey in body
    - Returns did
2. Get DID Document `/getDIDDoc/:did`:
    - GET request with did as query param
    - Returns object with context, did, name, and public key
3. Get Key Pair `/keyPair`:
    - GET request
    - Returns object with ethereum address, private key, and public key
4. Create Credential Schema `/createSchema`:
    - POST request with issuerDID, name, description, and properties in the form
      of array of objects in body
    - Returns did
5. Get Credential Schema `/getSchema/:did`:
    - GET request with did as query param
    - Returns object with context, did, name, description, and properties in the
      form of array of objects
6. Sign hash using Private key `/sign`:
    - POST request with hash and private key in request body
    - Returns string which is signed value of hash from the private key
7. Add Credential `/addCredential`:
    - POST request with issuerDID, ownerDID, properties array which contains
      user's data, and proof in request body
    - proof object consists of hash and the signed value of the hash
    - If the sign is valid then returns did of the newly created Credential
8. Get Credential `/getCredential`:
    - POST request with credDID, ownerDID, receiverDID, hash, and signed value
      of the hash in request body
    - Gives access to the receiver of the credential only if the owner is the
      owner of the Credential
    - If the sign is valid then Credential is returned
9. Get Credential `/getCredential`:
    - GET request with `req.query.credDID`, `req.query.did`, `req.query.hash`,
      and `req.query.sign` which maps to credential DID, receiver DID, unique
      hash, and sign of the hash using receiver's private key respectively
    - Returns DID to the receiver if and only if the receiver has access
    - Access to the receiver can be acquired by `POST /getCredential` request
      which contains ownerDID, hash, and signed value of hash to verify user
    - (New) Added hash and sign part to this endpoint so as someone else cannot
      mimic the receiver by sending receiver's DID.
    - Returns Credential
10. Revoke Access `/revokeAccess`:
    - POST request with credDID, ownerDID, receiverDID, hash, and signed value
      of the hash in request body
    - Revokes access of the receiverDID if the sign is valid and the owner of
      the credential is ownerDID
    - Returns a helpful message
11. Get name `/getName/:did`:
    - GET request with did as query param
    - Returns object with name property
12. Export Account `/exportAccount`:
    - POST request with did and data in request body
    - Adds the encrypted data to IPFS and creates mapping between did and returned hash
    - Does ***not*** return the IPFS hash, just returns a success message.
13. Import Account `/importAccount/:did`:
    - GET request with did as query param
    - Returns the encrypted data stored in IPFS