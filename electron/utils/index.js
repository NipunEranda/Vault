import fs, { write } from 'fs';
import CryptoJS from 'crypto-js';
import { homedir } from 'os';

const key = 'typ-149fmdn395lfms18rkvma';

const readConfig = () => {
    try {
        const contents = fs.readFileSync(`${homedir}/.typvault`, { encoding: 'utf-8' });
        return CryptoJS.AES.decrypt(contents, key).toString(CryptoJS.enc.Utf8);
    } catch (e) {
        writeConfig('{}');
        return '{}';
    }
}

const writeConfig = (obj) => {
    try {
        const text = CryptoJS.AES.encrypt(obj, key).toString();
        fs.writeFileSync(`${homedir}/.typvault`, text, { encoding: 'utf-8' });
    } catch (e) {
        console.log('Unable to write the file');
    }
}

export default {
    readConfig,
    writeConfig
};