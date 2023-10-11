export const abi=[
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "_doc",
				"type": "string"
			},
			{
				"internalType": "address",
				"name": "creator",
				"type": "address"
			}
		],
		"name": "CreateDocument",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_docId",
				"type": "uint256"
			},
			{
				"internalType": "address",
				"name": "_signer",
				"type": "address"
			}
		],
		"name": "addSigner",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "_doc",
				"type": "string"
			}
		],
		"name": "CreateDocument",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_docId",
				"type": "uint256"
			}
		],
		"name": "signDocument",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "documents",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "id",
				"type": "uint256"
			},
			{
				"internalType": "address",
				"name": "creator",
				"type": "address"
			},
			{
				"internalType": "string",
				"name": "documentMetaData",
				"type": "string"
			},
			{
				"internalType": "bool",
				"name": "isSigned",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_id",
				"type": "uint256"
			}
		],
		"name": "getDoc",
		"outputs": [
			{
				"components": [
					{
						"internalType": "uint256",
						"name": "id",
						"type": "uint256"
					},
					{
						"internalType": "address",
						"name": "creator",
						"type": "address"
					},
					{
						"internalType": "address[]",
						"name": "remainingSigners",
						"type": "address[]"
					},
					{
						"internalType": "address[]",
						"name": "signers",
						"type": "address[]"
					},
					{
						"internalType": "address[]",
						"name": "signedby",
						"type": "address[]"
					},
					{
						"internalType": "string",
						"name": "documentMetaData",
						"type": "string"
					},
					{
						"internalType": "bool",
						"name": "isSigned",
						"type": "bool"
					}
				],
				"internalType": "struct DocSign.Document",
				"name": "",
				"type": "tuple"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "user",
				"type": "address"
			}
		],
		"name": "getDocumentsSignedByUser",
		"outputs": [
			{
				"internalType": "uint256[]",
				"name": "",
				"type": "uint256[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "user",
				"type": "address"
			}
		],
		"name": "getDocumentsUnSignedByUser",
		"outputs": [
			{
				"internalType": "uint256[]",
				"name": "",
				"type": "uint256[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_docId",
				"type": "uint256"
			},
			{
				"internalType": "address",
				"name": "signer",
				"type": "address"
			}
		],
		"name": "signDocument",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	}
]