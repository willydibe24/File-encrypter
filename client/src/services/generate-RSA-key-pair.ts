const generateRSAKeyPair = async () => {
    const keyPair = await crypto.subtle.generateKey(
        {
            name: "RSA-OAEP",
            modulusLength: 2048,
            publicExponent: new Uint8Array([1, 0, 1]), // 65537
            hash: "SHA-256"
        },
        true,
        ["encrypt", "decrypt"]
    );
    
    return {
        publicKey: await crypto.subtle.exportKey("spki", keyPair.publicKey),
        privateKey: await crypto.subtle.exportKey("pkcs8", keyPair.privateKey)
    };
}


export default generateRSAKeyPair;