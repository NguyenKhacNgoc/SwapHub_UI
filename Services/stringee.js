import CryptoJS from "crypto-js";
const apiKeySid = 'SK.0.tcEsYA7KtOOCn7vPx2sE8BE2VrR77VB';
const apiKeySecret = 'Wkd1b2d1VFlNN2hLbnpKN1JLUG5rOVpxUjEwT3c3VWI=';
const generateToken = (apiKeySid, apiKeySecret) => {
    // Header
    const header = {
        typ: 'JWT',
        alg: 'HS256',
        cty: 'stringee-api;v=1',
    };

    // Payload
    const payload = {
        jti: apiKeySid, // JWT ID
        iss: apiKeySid, // API key sid
        exp: Math.floor(Date.now() / 1000) + 3600, // Expiration time (1 hour from now)
        rest_api: true,
    };

    // Encode header and payload
    const encodedHeader = CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(JSON.stringify(header)));
    const encodedPayload = CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(JSON.stringify(payload)));

    // Create token
    const token = `${encodedHeader}.${encodedPayload}`;

    // Create HMACSHA256 signature
    const signature = CryptoJS.HmacSHA256(token, apiKeySecret).toString(CryptoJS.enc.Base64);

    // Concatenate all parts to create the final token
    const bearerToken = `${token}.${signature}`;

    return bearerToken;
};
export const StringeeServices = {
    getBearerToken: () => {
        const token = generateToken(apiKeySid, apiKeySecret)
        return token
    }
};