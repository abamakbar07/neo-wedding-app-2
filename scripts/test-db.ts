import { testConnection } from '../lib/mongoose'

async function runTest() {
  await testConnection()
  process.exit()
}

runTest() 