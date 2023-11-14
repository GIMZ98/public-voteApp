git clone https://github.com/GIMZ98/public-voteApp.git
cd public-voteApp
npm install

# Add required variables to .env
    VITE_BASE_API_URI="Your Infura API URI"
    VITE_BASE_PRIVATE_KEY="Your wallet address private key"
    VITE_BASE_CONTRACT_ADDRESS='Contract address' //Can get only after deployed

# Deploy contracts
npx hardhat run scripts/deploy.js --network sepolia

# For run on local server
npm run dev




