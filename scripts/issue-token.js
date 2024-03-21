const TokenFarm = artifacts.require('ChemiCoin')

module.exports = async function(callback) {
    let chemiCoin = await ChemiCoin.deployed()
   
    // El código va aquí
    console.log('Tokens emitidos!')
    callback()
}