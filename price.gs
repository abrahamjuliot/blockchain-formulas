// https://www.youtube.com/watch?v=S25s6_27k9o
function cmcap(apiKey) {
  return {
    options: {
      method: 'GET',
      uri: 'https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest',
      qs: {
        'start': '1',
        'limit': '5000',
        'convert': 'USD'
      },
      headers: {
        'X-CMC_PRO_API_KEY': apiKey
      },
      json: true,
      gzip: true
    }
  }
}

function cacheData(key, coins) {
  var cache = CacheService.getDocumentCache()
  var json = cache.get(key)
  var minutes = 60

  if (!json) {
    var url = 'https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest?symbol='+coins.join(',')
    var api = cmcap('8e31b4d4-c294-40e6-8fcc-bdaeadefd99e')
    var res = UrlFetchApp.fetch(url, api.options)
    json = res.getContentText()
    cache.put(key, json, minutes*100)
    return cache.get(key)
  }
  
  return json
}

function coins() {
  return ['BTC','ETH','XRP','EOS','TRX','XLM','RVN','ADA','BAT','VET','BNB','LTC','BCH','NEXO','BSV','ETC','ZEC','ZRX','KIN','VTHO','BTT','REP'] 
}


function getPrice(amt, coin) {
  var json = cacheData('data', coins())
  var res = JSON.parse(json)
  var price = res.data[coin].quote['USD'].price
  return amt*price 
}




// cache api response 10 min.
// get inline symbol coinlib ?
// grin + doge https://live.blockcypher.com/




