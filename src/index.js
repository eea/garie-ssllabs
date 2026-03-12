const garie_plugin = require('garie-plugin')
const path = require('path');
const config = require('../config');


function getResults(url, file) {
    const key = 'ssl_score';
    const result = {};

    let parsed;
    try {
        parsed = JSON.parse(file);
    } catch (e) {
        console.log(`Invalid JSON report received for ${url}`);
        throw (`Invalid JSON report received for ${url}`);
    }

    const findings = [];
    const collectFindings = (node) => {
        if (!node) {
            return;
        }

        if (Array.isArray(node)) {
            node.forEach(collectFindings);
            return;
        }

        if (typeof node === 'object') {
            if (node.severity) {
                findings.push(node);
            }

            Object.keys(node).forEach((key) => {
                collectFindings(node[key]);
            });
        }
    };

    collectFindings(parsed);

    const severities = {
        INFO: 0,
        LOW: 0,
        MEDIUM: 0,
        HIGH: 0,
        CRITICAL: 0,
        FATAL: 0,
    };

    findings.forEach((item) => {
        const severity = String(item.severity || '').toUpperCase();

        if (severity === 'OK' || severity === 'WARN') {
            return;
        }

        if (Object.prototype.hasOwnProperty.call(severities, severity)) {
            severities[severity] += 1;
        }
    });

    const finalScores = [];
    const scanResults = Array.isArray(parsed.scanResult) ? parsed.scanResult : [];

    scanResults.forEach((scan) => {
        const rating = Array.isArray(scan.rating) ? scan.rating : [];
        const finalScoreEntry = rating.find((entry) => entry && entry.id === 'final_score');

        if (!finalScoreEntry || finalScoreEntry.finding === undefined || finalScoreEntry.finding === null) {
            return;
        }

        const score = Number(finalScoreEntry.finding);
        if (!Number.isNaN(score)) {
            finalScores.push(score);
        }
    });

    if (finalScores.length === 0) {
        console.log(`Did not receive final_score in report for ${url}`);
        throw (`Did not receive final_score in report for ${url}`);
    }

    result[key] = finalScores.reduce((a, b) => a + b, 0) / finalScores.length;
    result.testssl_findings = findings.length;
    result.ssl_info = severities.INFO;
    result.ssl_low = severities.LOW;
    result.ssl_medium = severities.MEDIUM;
    result.ssl_high = severities.HIGH;
    result.ssl_critical = severities.CRITICAL;
    result.ssl_fatal = severities.FATAL;

    console.log(`Final score ${result[key]} for ${url}`);

    return result;

}


const myGetFile = async (options) => {
    const { url } = options;
    options.fileName = 'ssllabs.json';
    var file = await garie_plugin.utils.helpers.getNewestFile(options);
    file = file.toString('utf8');
    return getResults(url, file);
}

const myGetData = async (item) => {
    const { url } = item.url_settings;
    return new Promise(async (resolve, reject) => {
        try {
            const { reportDir } = item;

            const options = { script: path.join(__dirname, './script.sh'),
                        url: url,
                        reportDir: reportDir,
                        timeout: 2000,
                        params: [ ],
                        callback: myGetFile
                    }
            const data = await garie_plugin.utils.helpers.executeScript(options);

            resolve(data);
        } catch (err) {
            console.log(`Failed to get data for ${url}`, err);
            reject(`Failed to get data for ${url}`);
        }
    });
};



console.log("Start");

const main = async () => {
  try{
    const { app } = await garie_plugin.init({
      db_name:'ssllabs',
      getData:myGetData,
      plugin_name:'ssllabs',
      report_folder_name:'ssllabs-results',
      app_root: path.join(__dirname, '..'),
      config:config,
      onDemand: true,
    });
    app.listen(3000, () => {
      console.log('Application listening on port 3000');
    });
  }
  catch(err){
    console.log(err);
  }
}

if (process.env.ENV !== 'test') {
  main()
}
