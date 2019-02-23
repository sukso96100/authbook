import aesjs from 'aes-js';
import pbkdf2 from 'pbkdf2';
// https://github.com/digitalbazaar/forge
//https://en.wikipedia.org/wiki/PBKDF2
export default class Crypto{
    static async decrypt(password, encryptedContent){
        
        const toDecrypt = aesjs.utils.hex.toBytes(encryptedContent);
        const salt = toDecrypt.slice(0, 16);
        const iv = toDecrypt.slice(16, 32);
        const content = toDecrypt.slice(32, toDecrypt.length);
        
        const secretKey = await Crypto.genSecret(password, new Buffer(salt, 'binary'), 65536, 256 / 8, 'sha512');
        const aesCbc = new aesjs.ModeOfOperation.cbc(secretKey, iv);
        const decryptedBytes = aesCbc.decrypt(content);

        // Convert our bytes back into text
        const decryptedText = aesjs.utils.utf8.fromBytes(decryptedBytes);
        return decryptedText.replace(/[^(a-z)(A-Z)(0-9)]+/, "");
    }
    
    static genSecret(password, salt, iterations, keylen, digest){
        return new Promise((resolve, reject) => {
            pbkdf2.pbkdf2(password, salt, iterations, keylen, digest, 
                         (err, derivedKey)=>{
                if(err) reject(err);
                resolve(derivedKey);
            });
        });
    }
}