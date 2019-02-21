#!/usr/bin/env bash
set -e

echo "Start getting data"

echo "Getting data for: $1"

report_location=$2/$(date +"%FT%H%M%S+0000")

mkdir -p $report_location

timeout 1800 docker run --read-only --cap-drop all --rm jumanjiman/ssllabs-scan:latest -grade -usecache $1 > $report_location/ssllabs.txt 2>&1

echo "Finished getting data for: $1"

exit 0

