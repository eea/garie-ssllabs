#!/usr/bin/env bash
set -e

echo "Start getting data"
echo "Getting data for: $1"

report_location=$2/$(date +"%FT%H%M%S+0000")

mkdir -p "$report_location"

run_scan() {
    timeout 1800 testssl.sh --warnings off --jsonfile-pretty "$report_location/ssllabs.json" "$1" > "$report_location/ssllabs.txt" 2>&1
}

json_is_valid() {
    node -e 'JSON.parse(require("fs").readFileSync(process.argv[1], "utf8"));' "$1" >/dev/null 2>&1
}

wait_for_valid_json() {
    json_file="$1"
    for _ in $(seq 1 30); do
        if [ -s "$json_file" ] && json_is_valid "$json_file"; then
            return 0
        fi
        sleep 1
    done
    return 1
}

run_scan "$1"

if ! wait_for_valid_json "$report_location/ssllabs.json"; then
    echo "There was a problem with testssl.sh for $1:"
    cat "$report_location/ssllabs.txt"
    echo "Will retry, after short pause"
    sleep "$(shuf -i 10-50 -n 1)"
    run_scan "$1"
fi

if ! wait_for_valid_json "$report_location/ssllabs.json"; then
    echo "JSON report is missing or invalid for $1"
    cat "$report_location/ssllabs.txt"
    exit 1
fi

echo "Finished getting data for: $1"

exit 0
