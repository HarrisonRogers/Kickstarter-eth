import path from 'path'
import { fileURLToPath } from 'url'
import fs from 'fs-extra'
import solc from 'solc'

// Get __dirname equivalent in ES module
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Remove build directory
const buildPath = path.resolve(__dirname, 'build')
fs.removeSync(buildPath)

// Read contract source code
const campaignPath = path.resolve(__dirname, 'contracts', 'Campaign.sol')
const source = fs.readFileSync(campaignPath, 'utf8')

// Set up input for Solidity compiler
const input = {
  language: 'Solidity',
  sources: {
    'Campaign.sol': {
      content: source,
    },
  },
  settings: {
    outputSelection: {
      '*': {
        '*': ['*'],
      },
    },
  },
}

// Compile the contract
const tempFile = JSON.stringify(input)
const output = JSON.parse(solc.compile(tempFile))

// Check for errors
if (output.errors) {
  output.errors.forEach((err) => {
    console.error(err.formattedMessage)
  })
  throw new Error('Compilation failed')
}

// Ensure build directory exists
fs.ensureDirSync(buildPath)

// Write compiled contracts to build directory
for (const contractName in output.contracts['Campaign.sol']) {
  const contract = output.contracts['Campaign.sol'][contractName]
  fs.outputJSONSync(path.resolve(buildPath, `${contractName}.json`), contract)
}

console.log('Contracts successfully compiled and saved to build directory.')
