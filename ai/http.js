const https = require('https');

function httpsJsonRequest({ method, url, headers, body }) {
  return new Promise((resolve, reject) => {
    const u = new URL(url);
    const req = https.request(
      {
        method,
        hostname: u.hostname,
        path: `${u.pathname}${u.search || ''}`,
        headers,
      },
      (res) => {
        let data = '';
        res.setEncoding('utf8');
        res.on('data', (chunk) => {
          data += chunk;
        });
        res.on('end', () => {
          try {
            const json = JSON.parse(data || '{}');
            if (res.statusCode && res.statusCode >= 200 && res.statusCode < 300) {
              resolve({ statusCode: res.statusCode, json });
              return;
            }
            const message =
              json?.error?.message ||
              json?.message ||
              `HTTP request failed (status ${res.statusCode ?? 'unknown'})`;
            reject(new Error(message));
          } catch (e) {
            reject(e);
          }
        });
      }
    );

    req.on('error', reject);
    if (body) req.write(body);
    req.end();
  });
}

module.exports = {
  httpsJsonRequest,
};

