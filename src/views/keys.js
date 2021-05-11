const { writeFileSync } = require("fs");
const { generateKeyPairSync } = require("crypto");
const crypto = require("crypto");
const path = require("path");
const fs = require("fs");

export function generateKeys() {
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
      passphrase: "xD",
    },
  });

  writeFileSync("private.pem", privateKey);
  writeFileSync("public.pem", publicKey);

  return {
    privateKey,
    publicKey,
  };
}

export function encrypt(toEncrypt, relativeOrAbsolutePathToPublicKey) {
  const absolutePath = path.resolve(relativeOrAbsolutePathToPublicKey);
  const publicKey = fs.readFileSync(absolutePath, "utf8");
  const buffer = Buffer.from(toEncrypt, "utf8");
  const encrypted = crypto.publicEncrypt(publicKey, buffer);
  return encrypted.toString("base64");
}

export function decrypt(toDecrypt, relativeOrAbsolutePathtoPrivateKey) {
  const absolutePath = path.resolve(relativeOrAbsolutePathtoPrivateKey);
  const privateKey = fs.readFileSync(absolutePath, "utf8");
  const buffer = Buffer.from(toDecrypt, "base64");
  const decrypted = crypto.privateDecrypt(
    {
      key: privateKey.toString(),
      passphrase: "xD",
    },
    buffer
  );
  return decrypted.toString("utf8");
}
