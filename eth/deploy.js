import 'dotenv/config'
import HDWalletProvider from '@truffle/hdwallet-provider'
import { Web3 } from 'web3'
import { readFileSync } from 'fs'

// Change JSON import to use readFileSync
const compiledFactory = JSON.parse(
  readFileSync('./build/CampaignFactory.json', 'utf8')
)
const abi = compiledFactory.abi
const bytecode = compiledFactory.evm.bytecode.object

const provider = new HDWalletProvider(
  process.env.DEPLOY_PHRASES,
  process.env.INFURA_ENDPOINT
)

const web3 = new Web3(provider)

const deploy = async () => {
  const accounts = await web3.eth.getAccounts()

  //using accounts[1] because accounts[0] is my main account and want to deploy from dev account
  console.log('Attempting to deploy from account', accounts[1])

  const result = await new web3.eth.Contract(abi)
    .deploy({ data: bytecode }) // Use bytecode directly
    .send({ gas: '2000000', from: accounts[1] })

  console.log(abi)
  console.log('Contract deployed to:', result.options.address)
  provider.engine.stop()
}

deploy()
