# Web3 Voting App

This is a web3 voting application which users can vote one of three candidates( 'Nam', 'Gim', 'Biz'). If you deployed this contract with some address, that address will get access to all functions defined in Voting.sol. Here only one address can vote for one user or else will get error message. Users who are connected the metamask wallet are able to vote and get current status and remaining time.

## Installation
```cmd
    git clone https://github.com/GIMZ98/public-voteApp.git
    cd public-voteApp
    npm install
```

## Add required variables to .env
```env
    VITE_BASE_API_URI="Your Infura API URI"
    VITE_BASE_PRIVATE_KEY="Your wallet address private key"
    VITE_BASE_CONTRACT_ADDRESS='Contract address' //Can get only after deployed
```

## Deploy contracts
```cmd
npx hardhat run scripts/deploy.js --network sepolia
```

## For run on local server
```cmd
npm run dev
```





