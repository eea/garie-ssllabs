const garie_plugin = require('garie-plugin')
const path = require('path');
const config = require('../config');
const express = require('express');
const bodyParser = require('body-parser');
const serveIndex = require('serve-index');


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


const myGetFile = async (options) => {
    const { url } = options;
    options.fileName = 'ssllabs.txt';
    var file = await garie_plugin.utils.helpers.getNewestFile(options);
    file = file.toString('utf8');
    return getResults(url, file);
}

const myGetData = async (item) => {
    const { url } = item.url_settings;
    return new Promise(async (resolve, reject) => {
        try {
            const { reportDir } = item;

            const options = { script: path.join(__dirname, './ssllabs.sh'),
                        url: url,
                        reportDir: reportDir,
                        params: [ ],
                        timeout: 600,
                        callback: myGetFile
                    }
            data = await garie_plugin.utils.helpers.executeScript(options);

            resolve(data);
        } catch (err) {
            console.log(`Failed to get data for ${url}`, err);
            reject(`Failed to get data for ${url}`);
        }
    });
};



console.log("Start");


const app = express();
app.use('/reports', express.static('reports'), serveIndex('reports', { icons: true }));

const main = async () => {
  garie_plugin.init({
    db_name:'ssllabs',
    getData:myGetData,
    plugin_name:'ssllabs',
    report_folder_name:'ssllabs-results',
    app_root: path.join(__dirname, '..'),
    config:config
  });
}

if (process.env.ENV !== 'test') {
  app.listen(3000, async () => {
    console.log('Application listening on port 3000');
    await main();
  });
}
