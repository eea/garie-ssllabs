const fs = require('fs-extra');
const path = require('path');
const child_process = require('child_process');
const { getSSLLabsResult, getData, getResults } = require('./');

const ssllabsTestData = fs.readFileSync('./test/mock-data/result.html');

jest.mock('child_process', () => {
    return {
        spawn: jest.fn(() => ({
            on: jest.fn((process, callback) => {
                callback();
            }),
            stdout: { pipe: jest.fn() },
            stderr: { pipe: jest.fn() }
        }))
    }
});

describe('ssllabs', () => {

    beforeEach(() => {
        const today = new Date();

        const filePath = path.join(__dirname, '../../reports/ssllabs-results/google.com', today.toISOString());
        fs.ensureDirSync(filePath);

        fs.writeFileSync(path.join(filePath, 'ssllabs.html'), ssllabsTestData);

    })

    afterEach(() => {
        fs.removeSync(path.join(__dirname, '../../../reports/ssllabs-results/google.com'));
    });

    describe('getSSLLabsResult', () => {

        it('finds and resolves the ssllabs results for the given url', async () => {

            const result = await getSSLLabsResult('google.com');

            expect(result).toEqual(getResults('google.com', ssllabsTestData));

        });

        it('rejects when no file can be found', async () => {
            fs.removeSync(path.join(__dirname, '../../reports/ssllabs-results/google.com'));
            await expect(getSSLLabsResult('google.com')).rejects.toEqual('Failed to get ssllabs file for google.com');
        });

    });

    describe('getData', () => {

        it('calls the shell script to get the data from ssllabs docker image and resolves with the ssllabs file flattened when succesfully finished', async () => {

            const data = await getData('google.com');
            expect(child_process.spawn).toBeCalledWith('bash', [path.join(__dirname, './ssllabs.sh'), 'google.com', "/usr/src/garie-ssllabs/reports/ssllabs-results/google.com"]);

            expect(data).toEqual(getResults('google.com', ssllabsTestData));


        });

        it('rejects when child process fails', async () => {

            child_process.spawn.mockImplementation(() => {
                throw new Error('Failed');
            })

            await expect(getData('google.com')).rejects.toEqual('Failed to get data for google.com');

        });


    });

});
