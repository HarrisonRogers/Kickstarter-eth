import assert from 'assert'
import ganache from 'ganache'
import { Web3 } from 'web3'
import compiledFactory from '../eth/build/CampaignFactory.json' assert { type: 'json' }
import compiledCampaign from '../eth/build/Campaign.json' assert { type: 'json' }

// Configure Ganache with higher limits
const ganacheProvider = ganache.provider({
  gasLimit: 8000000,
  logging: {
    quiet: true,
  },
})

const web3 = new Web3(ganacheProvider)

let accounts
let factory
let campaignAddress
let campaign

beforeEach(async () => {
  accounts = await web3.eth.getAccounts()

  factory = await new web3.eth.Contract(compiledFactory.abi)
    .deploy({ data: compiledFactory.evm.bytecode.object })
    .send({
      from: accounts[0],
      gas: '5000000',
    })

  await factory.methods.createCampaign('100').send({
    from: accounts[0],
    gas: '3000000',
  })

  const addresses = await factory.methods.getDeployedCampaigns().call()
  campaignAddress = addresses[0]
  campaign = await new web3.eth.Contract(compiledCampaign.abi, campaignAddress)
})

describe('Campaigns', () => {
  it('deploys a factory and campaign', () => {
    assert.ok(factory.options.address)
    assert.ok(campaign.options.address)
  })
})
