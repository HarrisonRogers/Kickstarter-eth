import 'dotenv/config';
import HDWalletProvider from '@truffle/hdwallet-provider';
import { Web3 } from 'web3';
import { readFileSync } from 'fs';

// Change JSON import to use readFileSync
const compiledFactory = JSON.parse(
  readFileSync('./build/CampaignFactory.json', 'utf8')
);
const abi = compiledFactory.abi;
const bytecode = compiledFactory.evm.bytecode.object;

const provider = new HDWalletProvider(
  process.env.DEPLOY_PHRASES,
  process.env.INFURA_ENDPOINT
);

const web3 = new Web3(provider);

const deploy = async () => {
  const accounts = await web3.eth.getAccounts();

  try {
    // Estimate gas first
    const contract = new web3.eth.Contract(abi);
    const deploy = contract.deploy({
      data: bytecode,
    });

    const estimatedGas = await deploy.estimateGas();
    console.log('Estimated gas:', estimatedGas.toString());

    const gasLimit = Number(estimatedGas) * 1.2;
    console.log('Using gas limit:', Math.round(gasLimit));

    const result = await deploy.send({
      from: accounts[1],
      gas: Math.round(gasLimit),
    });

    console.log(abi);
    console.log('Contract deployed to:', result.options.address);
    console.log('Deployment successful! 🎉');
  } catch (error) {
    console.error('Deployment error:', error);
    process.exit(1);
  } finally {
    provider.engine.stop();
  }
};

deploy();
