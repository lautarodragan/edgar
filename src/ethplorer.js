const fetch = require('node-fetch')

module.exports.getHodlers = async function getHodlers() {
  const contractUrl = `https://api.ethplorer.io/getTokenInfo/0x0e0989b1f9b8a38983c2ba8053269ca62ec9b195?apiKey=freekey`
  const contractStatsResponse = await fetch(contractUrl)
  const contractStats = await contractStatsResponse.json()
  console.log('contractStats', contractStats)
  return contractStats.holdersCount
}
