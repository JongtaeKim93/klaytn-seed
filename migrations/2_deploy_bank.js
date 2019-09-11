const fs = require('fs');
const AzureUploader = require('@flui/klaytn-uploader').AzureUploader;
const JTCard = artifacts.require('JTCard');

module.exports = function(deployer) {
	deployer.deploy(JTCard).then(() => {
		const data = JSON.stringify({
			contractAddress: JTCard.address
		});

		if (!fs.existsSync('./artifacts')) {
			fs.mkdirSync('./artifacts');
			console.log(`\n    Create Artifacts`);
		}

		fs.writeFileSync('./artifacts/address.json', data);
		console.log(`\n    Create file of contract address to json: ${JTCard.address}`);

		const abi = JSON.stringify(JTCard._json.abi);
		fs.writeFileSync('./artifacts/abi.json', abi);
		console.log(`\n    Create file of abi file to json: ${JTCard.address}`);

		const accountName = process.env.AZURE_STORAGE_ACCOUNT_NAME;
		const accessKey = process.env.AZURE_STORAGE_ACCOUNT_ACCESS_KEY;
		const uploader = new AzureUploader(accountName, accessKey);

		const containerName = process.env.AZURE_STORAGE_CONTRACT_CONTAINER_NAME;
		uploader.uploadArtifacts(JTCard._json.contractName, 'artifacts', containerName);
	});
};
