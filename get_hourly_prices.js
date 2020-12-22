var page = require('webpage').create();
page.settings.userAgent = 'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:84.0) Gecko/20100101 Firefox/84.0';
page.open('https://www.helen.fi/en/electricity/electricity-products-and-prices/exchange-electricity', function(status) {
    try {
        if (status !== 'success') {
            console.log('Unable to access network');
            phantom.exit();
        }
        var todayPrice = document.getElementById('todayPrice');
        var prices = page.evaluate(function () {
            var chartToday = todayPrice.getElementsByClassName('highcharts-series-group').item(0);
            var chartPoints = chartToday.getElementsByTagName("rect");
            var i = 0;
            var result = {};
            result['date']  = new Date().toISOString().slice(0, 10);
            result['prices'] = [];
            if (typeof chartPoints == "undefined" || chartPoints.length !== 24) {
                return result;
            }
            for (i; i < chartPoints.length; i++) {
                var chartPoint = chartPoints[i];
                if (typeof chartPoint != 'undefined') {
                    var pointLabel = chartPoint.getAttribute('aria-label');
                    if (typeof pointLabel == 'string') {
                        var value = pointLabel.split(', ');
                        if (value.length > 1) {
                            var priceValue = value.pop().slice(0, -1);
                            var hour = value.pop().split('. ');
                            if (hour.length > 0) {
                                var hourValue = hour.pop();
                                var hourPrice = {
                                    hour: hourValue,
                                    price: priceValue
                                };
                                result['prices'].push(hourPrice);
                            }
                        }
                    }
                }
            }
            return result;
        });
        var jsonResult = JSON.stringify(prices, null, 2);
        console.log(jsonResult);
        var fs = require('fs');
        var resultFolder = './prices/';
        var pathToday = resultFolder + 'today.json';
        var pathDate = resultFolder + prices['date'] + '.json';
        fs.write(pathToday, jsonResult, 'w');
        fs.write(pathDate, jsonResult, 'w');
    } catch (ex) {
        var message = '\nException';
        message += '\nError: ' + ex.toString();
        for (var p in ex) {
            message += '\n' + p.toUpperCase() + ': ' + ex[p];
        }
        console.log(message);
    }
    phantom.exit();
});