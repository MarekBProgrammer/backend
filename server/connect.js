require('dotenv').config();
const { client, connectDb } = require('./mangodb.js');

let fetchFn;
if (typeof globalThis.fetch === 'function') {
    fetchFn = globalThis.fetch.bind(globalThis);
} else {
    const nf = require('node-fetch');
    fetchFn = nf.default || nf;
}

const apiUrl = process.env.API_URL;
const apiKey = process.env.API_KEY;

async function fetchData(){
    const lastfetch = new Date(Date.now() - 120000).toISOString();
    const response = await fetchFn(apiUrl, {
    method: 'GET',
    headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
    },
    });
    if (!response.ok) {
        console.error('fetchData: non-OK response', response.status);
        return [];
    }
    try {
        const data = await response.json();
        return data;
    } catch (err) {
        console.error('fetchData: invalid JSON response', err);
        return [];
    }
}
  
module.exports = { fetchData, client, connectDb };