import 'dotenv/config';


const PORT = process.env.PORT || 3000;
const DOMAIN = `http://localhost:${PORT}`;


async function request(method: string, path: string, option?: {}) {
    const res = await fetch(DOMAIN + path, option);
    const { url, status, headers } = res;

    console.log(`\n\n\n\n${method}:`, [url, status]);
    let content = null;

    if (headers.get('content-type')?.includes('application/json')) {
        content = await res.json();
        console.log('RESPONSE BODY:', content);
    }

    if (status >= 400) process.exit(0);

    return content;
}

export async function get(path: string, query = {}, headers?: {}) {
    if (Object.keys(query).length > 0) {
        path += '?' + new URLSearchParams(query);
    }

    return await request('GET', path, { headers });
}

export async function post(path: string, body = {}, headers?: {}) {
    return await request('POST', path, {
        method: 'POST',
        body: JSON.stringify(body),
        headers,
    });
}