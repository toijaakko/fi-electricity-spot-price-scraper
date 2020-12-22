#!/bin/sh
max_cost=7.5

e_monthly=3.93
e_marginal=0.24
t_monthly=5.90
t_cost=3.14
t_nightly_cost=1.80
tax=1.24

hour=$(date +"%-k")
e_price=$(jq '.prices[] | select(.hour=='$hour') | .price' prices/today.json)
date=$(jq '.date' prices/today.json)
date +"%Y-%m-%d %H:%M"
echo "Current: hour $hour"
e_cost=$(echo $e_marginal+$e_price | bc)
e_tax_cost=$(echo $e_cost*$tax | bc)
echo "$e_marginal"
echo "$e_price"
echo "Transmission cost: $t_cost c/kWh"
echo "Current electricity cost: $e_tax_cost c/kWh"
echo "Max cost for mining: $max_cost c/kWh"
total_cost=$(echo $e_price+$t_cost | bc)
echo "Current total cost: $total_cost c/kWh"

if [ -z "$total_cost" ]
then
  echo "Current prices not available"
  exit
fi

if [ 1 -eq "$(echo "${total_cost} > ${max_cost}" | bc)" ]
then
  echo "Electricity price too hight to mine!"
  echo "Closing miner"
  screen -S miner -X quit 1>/dev/null
else
  echo "Price is low enough for mining"
  echo "Starting miner"
  screen -S miner -Q select . 1>/dev/null || screen -dmS miner bash -c "./start_eth_4gb.sh"
fi
