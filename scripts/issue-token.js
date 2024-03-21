const TokenFarm = artifacts.require('ChemiCoin')

module.exports = async function(callback) {
    let chemiCoin = await ChemiCoin.deployed()
    await chemiCoin.issueTokens()
    // El código va aquí
    console.log('Tokens emitidos!')
    callback()
}