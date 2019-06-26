function getHistory(amt, coin, date, api) {
  var key = coin+'_'+date
  var json = cacheHistoryData(key, coin, date, api)
  var res = JSON.parse(json)
  var price = res.USD
  return amt*price 
}


function cacheHistoryData(key, coin, date, api) {
  var cache = CacheService.getDocumentCache()
  var json = cache.get(key)
  var minutes = 60

  if (!json) {
    var url = 'https://min-api.cryptocompare.com/data/dayAvg?fsym='+coin+'&tsym=USD&toTs='+date+'&api_key='+api
    var res = UrlFetchApp.fetch(url)
    json = res.getContentText()
    cache.put(key, json, minutes*100)
    return cache.get(key)
  }
  
  return json
}


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

function cacheData(key, coins, api) {
  var cache = CacheService.getDocumentCache()
  var json = cache.get(key)
  var minutes = 60

  if (!json) {
    var url = 'https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest?symbol='+coins.join(',')
    var api = cmcap(api)
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


function getPrice(amt, coin, api) {
  var key = 'data'
  var json = cacheData(key, coins(), api)
  var res = JSON.parse(json)
  var price = res.data[coin].quote['USD'].price
  return amt*price 
}

function getPercentChange(span, coin, api) {
  //if (span != '1h' || span != '24h' || span != '7d') { return 'no data'} 
  var key = 'data'
  var json = cacheData(key, coins(), api)
  var res = JSON.parse(json)
  var percent = res.data[coin].quote['USD']['percent_change_'+span]
  return percent
}







