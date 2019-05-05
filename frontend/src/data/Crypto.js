// import aesjs from 'aes-js';
// import pbkdf2 from 'pbkdf2';
import CryptoJS from 'crypto-js';

// https://github.com/digitalbazaar/forge
// https://en.wikipedia.org/wiki/PBKDF2
// https://cryptojs.gitbook.io/docs/
export default class Crypto {
  static async decrypt(password, encryptedContent) {
    return new Promise((resolve, reject)=>{
      const salt = CryptoJS.enc.Hex.parse(encryptedContent.slice(0, 32));
      const iv = CryptoJS.enc.Hex.parse(encryptedContent.slice(32, 64));
      // const content = Buffer.from(encryptedContent.slice(64, encryptedContent.length), 'hex').toString('base64');
      const content = CryptoJS.enc.Hex.parse(encryptedContent.slice(64, encryptedContent.length));
      const secretKey = CryptoJS.PBKDF2(password, salt, {
        keySize: 256 / 32, iterations: 20000,
        hasher: CryptoJS.algo.SHA512,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7,
      });

      const decrypted = CryptoJS.AES.decrypt({ciphertext: content}, secretKey, {iv: iv});
      resolve(decrypted.toString(CryptoJS.enc.Utf8));
    });
  }
}
