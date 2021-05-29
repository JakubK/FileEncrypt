const { generateKeyPairSync } = require("crypto");
const crypto = require("crypto");

export function myGenerateKeys(_, phrase = "supersecret") {
  const { privateKey, publicKey } = generateKeyPairSync("rsa", {
    modulusLength: 4096,
    publicKeyEncoding: {
      type: "pkcs1",
      format: "pem",
    },
    privateKeyEncoding: {
      type: "pkcs1",
      format: "pem",
      cipher: "aes-256-cbc",
      passphrase: phrase,
    },
  });

  return {
    privateKey,
    publicKey,
  };
}

export function myEncrypt(toEncrypt, publicKeyValue) {
  const buffer = Buffer.from(toEncrypt, "utf-8");
  const encrypted = crypto.publicEncrypt(publicKeyValue, buffer);
  return encrypted.toString("base64");
}

export function myDecrypt(toDecrypt, privateKeyValue, phrase = "supersecret") {
  const buffer = Buffer.from(toDecrypt, "base64");
  const decrypted = crypto.privateDecrypt(
    {
      key: privateKeyValue,
      passphrase: phrase,
    },
    buffer
  );
  return decrypted.toString("utf8");
}
