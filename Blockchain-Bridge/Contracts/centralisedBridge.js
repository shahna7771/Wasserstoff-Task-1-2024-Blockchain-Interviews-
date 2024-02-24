const Web3 = require('web3');

// Configure the web3 provider (replace 'YOUR_PROVIDER_URL' with the actual Ethereum node URL)
const web3Provider = new Web3.providers.HttpProvider('Yhttps://bsc-dataseed.binance.org/');
const web3 = new Web3(web3Provider);

// Replace with the actual contract ABI and address
const contractABI = [[
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "sender",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "targetChain",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "receiver",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "TokensLocked",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "tokenAddress",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			},
			{
				"internalType": "address",
				"name": "targetChain",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "receiver",
				"type": "address"
			}
		],
		"name": "lockERC20",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "targetChain",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "receiver",
				"type": "address"
			}
		],
		"name": "lockETH",
		"outputs": [],
		"stateMutability": "payable",
		"type": "function"
	}
]];  // ABI of the LockContract
const contractAddress = '0xd9145CCE52D386f254917e481eB44e9943F39138';  // Address of the LockContract on the Ethereum chain


const lockContract = new web3.eth.Contract(contractABI, contractAddress);

//  address of the ReleaseContract on the non-EVM chain
const releaseContractAddress = '0xd9145CCE52D386f254917e481eB44e9943F39138';

// Function to monitor lock events and trigger the release process
async function monitorLockEvents() {
    const latestBlock = await web3.eth.getBlockNumber();

    
    const lockEvent = lockContract.events.TokensLocked({ fromBlock: latestBlock, toBlock: 'latest' });

    lockEvent.on('data', async (event) => {
        const { user, targetChain, targetAddress, amount } = event.returnValues;

        console.log(`Lock event detected: User ${user} locked ${amount} tokens for release on ${targetChain} to ${targetAddress}`);

        
        await triggerReleaseProcess(user, amount, event.transactionHash);
    });

    lockEvent.on('error', (error) => {
        console.error('Error processing lock event:', error);
    });
}

// Function to trigger the release process on the non-EVM chain
async function triggerReleaseProcess(user, amount, transactionHash) {
    // Implement logic to communicate with the ReleaseContract on the non-EVM chain
    // You may use an HTTP request, WebSocket, or any other suitable method to trigger the release process
    const releaseEvent = lockContract.events.TokensReleased({ fromBlock: latestBlock, toBlock: 'latest' });
    console.log(`Triggering release process for user ${user} with amount ${amount} (TxHash: ${transactionHash})`);

    // Example: Send HTTP request to ReleaseContract API endpoint
    // Replace 'YOUR_RELEASE_CONTRACT_API_URL' with the actual API endpoint
    const releaseContractABytecode = '608060405234801561000f575f80fd5b50604051610531380380610531833981810160405281019061003191906100d4565b805f806101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff160217905550506100ff565b5f80fd5b5f73ffffffffffffffffffffffffffffffffffffffff82169050919050565b5f6100a38261007a565b9050919050565b6100b381610099565b81146100bd575f80fd5b50565b5f815190506100ce816100aa565b92915050565b5f602082840312156100e9576100e8610076565b5b5f6100f6848285016100c0565b91505092915050565b6104258061010c5f395ff3fe608060405234801561000f575f80fd5b5060043610610034575f3560e01c806389957c8114610038578063f40d71f114610056575b5f80fd5b610040610072565b60405161004d9190610209565b60405180910390f35b610070600480360381019061006b9190610283565b610095565b005b5f8054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b5f8054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff1614610122576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161011990610341565b60405180910390fd5b61012d3383836101be565b61016c576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610163906103a9565b60405180910390fd5b8173ffffffffffffffffffffffffffffffffffffffff167fc7798891864187665ac6dd119286e44ec13f014527aeeb2b8eb3fd413df93179826040516101b291906103d6565b60405180910390a25050565b5f600190509392505050565b5f73ffffffffffffffffffffffffffffffffffffffff82169050919050565b5f6101f3826101ca565b9050919050565b610203816101e9565b82525050565b5f60208201905061021c5f8301846101fa565b92915050565b5f80fd5b61022f816101e9565b8114610239575f80fd5b50565b5f8135905061024a81610226565b92915050565b5f819050919050565b61026281610250565b811461026c575f80fd5b50565b5f8135905061027d81610259565b92915050565b5f806040838503121561029957610298610222565b5b5f6102a68582860161023c565b92505060206102b78582860161026f565b9150509250929050565b5f82825260208201905092915050565b7f4f6e6c792045564d206272696467652063616e2063616c6c20746869732066755f8201527f6e6374696f6e0000000000000000000000000000000000000000000000000000602082015250565b5f61032b6026836102c1565b9150610336826102d1565b604082019050919050565b5f6020820190508181035f8301526103588161031f565b9050919050565b7f4c6f636b206576656e7420766572696669636174696f6e206661696c656400005f82015250565b5f610393601e836102c1565b915061039e8261035f565b602082019050919050565b5f6020820190508181035f8301526103c081610387565b9050919050565b6103d081610250565b82525050565b5f6020820190506103e95f8301846103c7565b9291505056fea2646970667358221220f697c65f2ee25d45d084589b0a90e985bc825d30177e89083e438fb8d15ac27d64736f6c63430008180033';
    const response = await fetch(releaseContractABytecode, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ user, amount, transactionHash }),
    });

    const responseData = await response.json();
    console.log('Release process triggered:', responseData);
}

//  monitoring lock events
monitorLockEvents();