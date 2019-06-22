function blockchain() {
  return {
    BTC: function() {
      return {
        url: function(wallet) { return 'https://blockchain.info/rawaddr/'+wallet },
        balance: function(res) { return res.final_balance },
        decimalPlace: 8
      }
    },
    LTC: function() {
      return {
        url: function(wallet) { return 'https://api.blockcypher.com/v1/ltc/main/addrs/'+wallet+'/balance'},
        balance: function(res) { return res.final_balance },
        decimalPlace: 8
      }
    },
    blockchair: function(chain) {
      return {
        url: function(wallet) { return 'https://api.blockchair.com/'+chain+'/dashboards/address/'+wallet},
        balance: function(res, wallet) { return res.data[wallet].address.balance },
        decimalPlace: 8
      }
    },
    BCH: function() { return this.blockchair('bitcoin-cash')},
    BSV: function() { return this.blockchair('bitcoin-sv')},
    ETC: function() {
      return { 
        url: function(wallet) { return 'https://api.gastracker.io/addr/'+wallet},
        balance: function(res) { return res.balance.ether },
        decimalPlace: 0
      }
    },
    ETH: function() {
      return {
        url: function(wallet, apiKey) { return 'https://api.etherscan.io/api?module=account&action=balance&address='+wallet+'&tag=latest&apikey='+apiKey},
        balance: function(res) { return res.result },
        decimalPlace: 18
      }
    },
    ETH_TOKEN: { 
      url: function(wallet, apiKey, contract) { return 'https://api.etherscan.io/api?module=account&action=tokenbalance&contractaddress='+contract+'&address='+wallet+'&tag=latest&apikey='+apiKey},
      balance: function(res) { return res.result },
      decimalPlace: 18
    },
    BAT: function() { return this.ETH_TOKEN },
    ZRX: function() { return this.ETH_TOKEN },
    NEXO: function() { return this.ETH_TOKEN },
    ZEC: function() {
      return { 
        url: function(wallet) { return 'https://chain.so/api/v2/get_address_balance/ZEC/'+wallet},
        balance: function(res) { return res.data.confirmed_balance },
        decimalPlace: 0
      }
    },
    XRP: function() {
      return {
        url: function(wallet) { return 'https://api.xrpscan.com/api/v1/account/'+wallet},
        balance: function(res) { return res.xrpBalance },
        decimalPlace: 0
      }
    },
    XLM: function() {
      return {
        url: function(wallet) { return 'https://horizon.stellar.org/accounts/'+wallet},
        balance: function(res) { return res.balances[0].balance },
        decimalPlace: 0
      }
    },
    EOS: function() {
      return {
        url: function(wallet, apiKey) { return 'https://api.eospark.com/api?module=account&action=get_account_balance&apikey='+apiKey+'&account='+wallet},
        balance: function(res) { return (+res.data.balance) + (+res.data.stake_to_self) },
        decimalPlace: 0
      }
    },
    TRX: function() {
      return {
        url: function(wallet) { return 'https://api.trongrid.io/v1/accounts/'+wallet},
        balance: function(res) { return res.data[0].balance },
        decimalPlace: 6
      }
    },
    BTT: function() {
      return { 
        url: function(wallet) { return 'https://api.trongrid.io/v1/accounts/'+wallet },
        balance: function(res) { return res.data[0].assetV2.filter(function(obj){ return obj.key === '1002000' /*BTT*/})[0].value },
        decimalPlace: 6
      }
    },
    RVN: function() {
      return {
        url: function(wallet) { return 'https://ravencoin.network/api/addr/'+wallet+'/balance'},
        balance: function(res) { return res },
        decimalPlace: 8
      }
    },
    ADA: function() {
      return { 
        url: function(wallet) { return 'https://cardanoexplorer.com/api/addresses/summary/'+wallet},
        balance: function(res) { return res["Right"].caBalance.getCoin },
        decimalPlace: 6
      }
    },
    BNB: function() {
      return { 
        url: function(wallet) { return 'https://dex.binance.org/api/v1/account/'+wallet},
        balance: function(res) { return res.balances[0].free },
        decimalPlace: 0
      }
    } 
  }
}

function fetch(url) {
  var options = { method: 'GET'}
  var req = UrlFetchApp.fetch(url, options)
  var json = req.getContentText()
  var res = JSON.parse(json)
  return res
}

function WALLET(coin, wallet, optionalApiKey, optionalContract) {
  var api = blockchain()[coin]()  
  var url = api.url(wallet, optionalApiKey, optionalContract)
   
  var res = fetch(url)
  var balance = api.balance(res, wallet) // wallet is optional
  var decimal = Math.pow(10, api.decimalPlace)
  return (balance/decimal).toFixed(8)
}
