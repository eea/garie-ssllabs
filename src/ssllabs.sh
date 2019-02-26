#!/usr/bin/env bash
set -e

echo "Start getting data"

echo "Getting data for: $1"

report_location=$2/$(date +"%FT%H%M%S+0000")

mkdir -p $report_location

timeout 1800 docker run --read-only --cap-drop all --rm jumanjiman/ssllabs-scan:latest -grade $1 > $report_location/ssllabs.txt 2>&1

if [ $(grep "Assessment complete:"  $report_location/ssllabs.txt | wc -l ) -eq 0 ]; then
	echo "There was a problem with docker for $1:"
	cat $report_location/ssllabs.txt
	echo "Will retry, after short pause"
	sleep $(shuf -i 10-50 -n 1)
	timeout 1800 docker run --read-only --cap-drop all --rm jumanjiman/ssllabs-scan:latest -grade $1 > $report_location/ssllabs.txt 2>&1
fi


echo "" >> $report_location/ssllabs.txt

echo "To re-run the test online, try:" >>  $report_location/ssllabs.txt


url=$(echo $1 | awk -F[/:] '{print $4}')

# if null, will keep the old format
url=${url:-$1}


echo "https://www.ssllabs.com/ssltest/analyze.html?d=${url}&hideResults=on"   >>  $report_location/ssllabs.txt


echo "Finished getting data for: $1"

exit 0

