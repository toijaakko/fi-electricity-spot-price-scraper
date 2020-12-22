# fi-electricity-spot-price-scraper
FI electricity spot-price scraper
# Use case
Get Nord Pool electricity exchange's day-ahead hourly spot-prices for FI region from
[Helen](https://www.helen.fi/en/electricity/electricity-products-and-prices/exchange-electricity) in JSON format
# Prerequisites
* [teamredminer](https://github.com/todxx/teamredminer)
* [PhantomJS](https://phantomjs.org/)
# Install
* Install PhantomJS
#Usage
Run `./get_prices.sh` to get hourly prices that are store in prices folder
Run `./run_miner.sh` to run eth teamredminer 
Setup crontab for cron to check prices (fetches prices once a night) and run miner every hour
#Author
Jaakko Toivanen (jaakko.toivanen@live.fi)