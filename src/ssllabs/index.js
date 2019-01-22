const fs = require('fs');
const path = require('path');
const flatten = require('flat');
const child_process = require('child_process');
const urlParser = require('url');
const crypto = require('crypto');
const isEmpty = require('lodash.isempty');
const logger = require('../utils/logger');


function pathNameFromUrl(url) {
  const parsedUrl = urlParser.parse(url),
    pathSegments = parsedUrl.pathname.split('/');

  pathSegments.unshift(parsedUrl.hostname);

  if (!isEmpty(parsedUrl.search)) {
    const md5 = crypto.createHash('md5'),
      hash = md5
        .update(parsedUrl.search)
        .digest('hex')
        .substring(0, 8);
    pathSegments.push('query-' + hash);
  }

  return pathSegments.filter(Boolean).join('-');
}

function reportDir(url) {
    return path.join(__dirname, '../../reports/ssllabs-results', pathNameFromUrl(url));
}

function getResults(url, file) {
    const regex = RegExp('"'+url+'": "(.*)"', 'g');

    const grade = regex.exec(file);

    var result = {};

    const key = 'ssl_score';

    if (grade == null){
	console.log("Did not receive a score, will set 0"); 
	console.log(file);
	result[key] = 0;
	return result
    }

    console.log("Received score "+grade[1]+" for "+url);

    switch(grade[1]){
        case 'A+':
            result[key] = 100;
            break;
        case 'A':
            result[key] = 90;
            break;
        case 'A-':
            result[key] = 80;
            break;
        case 'B':
            result[key] = 65;
            break;
        case 'C':
            result[key] = 50;
            break;
        case 'D':
            result[key] = 35;
            break;
        case 'E':
            result[key] = 20;
            break;
        case 'F':
            result[key] = 10;
            break;
        default:
        result[key] = 0;
    }
    return result;

}

const getSSLLabsResult = (url = '') => {
    try {
        const folders = fs.readdirSync(reportDir(url));

        const newestFolder = folders[folders.length - 1];

        const ssllabsFile = fs.readFileSync(path.join(reportDir(url), newestFolder, 'ssllabs.html'), "utf8");

        return Promise.resolve(getResults(url, ssllabsFile));

    } catch (err) {
        console.log(err);
        const message = `Failed to get ssllabs file for ${url}`;
        logger.warn(message);
        return Promise.reject(message);
    }
};

const getData = async url => {
    return new Promise(async (resolve, reject) => {
        try {
            const child = child_process.spawn('bash', [path.join(__dirname, './ssllabs.sh'), url, reportDir(url)]);

            child.on('exit', async () => {
                logger.info(`Finished getting data for ${url}, trying to get the results`);
                const data = await getSSLLabsResult(url);
                resolve(data);
            });

            child.stdout.pipe(process.stdout);
            child.stderr.pipe(process.stderr);
        } catch (err) {
            logger.warn(`Failed to get data for ${url}`, err);
            reject(`Failed to get data for ${url}`);
        }
    });
};

module.exports = {
    getSSLLabsResult,
    getData,
    getResults
};
