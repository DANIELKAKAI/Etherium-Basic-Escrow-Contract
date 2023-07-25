//const Web3 = require('web3');
const contractAbi = [
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "_buyer",
                "type": "address"
            },
            {
                "internalType": "address",
                "name": "_seller",
                "type": "address"
            },
            {
                "internalType": "address",
                "name": "_arbiter",
                "type": "address"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "constructor"
    },
    {
        "anonymous": false,
        "inputs": [],
        "name": "ApprovedByBuyer",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [],
        "name": "ApprovedBySeller",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": false,
                "internalType": "address",
                "name": "depositor",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
            }
        ],
        "name": "PaymentDeposited",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": false,
                "internalType": "address",
                "name": "refundRecipient",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
            }
        ],
        "name": "Refunded",
        "type": "event"
    },
    {
        "inputs": [],
        "name": "amount",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "approveByBuyer",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "approveBySeller",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "arbiter",
        "outputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "buyer",
        "outputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "buyerApproved",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "currentState",
        "outputs": [
            {
                "internalType": "enum Escrow.State",
                "name": "",
                "type": "uint8"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "deposit",
        "outputs": [],
        "stateMutability": "payable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "refundBuyer",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "seller",
        "outputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "sellerApproved",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    }
];

const escrowContractAddress = "0xD52f77A27340b8Bb240Dd68c96BEC5EbEc85D21b";
//const privateKey = 'YOUR_PRIVATE_KEY';

const web3 = new Web3("http://localhost:7545");

//const account = web3.eth.accounts.privateKeyToAccount(privateKey);
//web3.eth.accounts.wallet.add(account);
//web3.eth.defaultAccount = account.address;

const escrowContract = new web3.eth.Contract(contractAbi, escrowContractAddress);

async function depositFunds(address = null, etherAmount = null) {

    if (!address && !etherAmount) {
        address = document.getElementById("address").value ? document.getElementById("address").value : null;
        etherAmount = document.getElementById("amount").value ? document.getElementById("amount").value : null;
    }
    const depositAmount = web3.utils.toWei(etherAmount, 'ether');

    try {
        const depositTx = await escrowContract.methods.deposit().send({
            from: address,
            value: depositAmount,
        });

        console.log('Transaction hash:', depositTx.transactionHash);
    } catch (error) {
        console.error('Error depositing funds:', error);
    }
}

async function approveByBuyer(address) {
    try {
        const approvalTx = await escrowContract.methods.approveByBuyer().send({
            from: address,
        });

        console.log('Transaction hash:', approvalTx.transactionHash);
    } catch (error) {
        console.error('Error approving by buyer:', error);
    }
}

async function approveBySeller(address) {
    try {
        const approvalTx = await escrowContract.methods.approveBySeller().send({
            from: address,
        });

        console.log('Transaction hash:', approvalTx.transactionHash);
    } catch (error) {
        console.error('Error approving by seller:', error);
    }
}

async function refundBuyer(address) {
    try {
        const refundTx = await escrowContract.methods.refundBuyer().send({
            from: address,
        });

        console.log('Transaction hash:', refundTx.transactionHash);
    } catch (error) {
        console.error('Error refunding the buyer:', error);
    }
}

async function checkAmount() {
    const balance = await escrowContract.methods.amount().call();
    console.log("Amount:", balance);
}

async function checkStatus() {
    const status = await escrowContract.methods.currentState().call();
    console.log("Status:", status);
}

async function addressBalance(address) {
    const balance = await web3.eth.getBalance(address);
    console.log("Balance: ", balance);
}

//checkAmount();
//depositFunds("0x3dA4ebD27ccafaA1285C4a7242e33b96a88EEB4E", "1");
//checkAmount();

//addressBalance("0xcb0a2c74d6E9d3D61279a0a8d8f9f1e8d4b07142");
//addressBalance("0xDb306B4F524F502dDDe54d057d88f4e03Dbc7abC");
//addressBalance("0x3dA4ebD27ccafaA1285C4a7242e33b96a88EEB4E");

//checkAmount();