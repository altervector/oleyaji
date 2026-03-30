const https = require('https');

exports.handler = async (event) => {
    const { AIRTABLE_BASE_ID, AIRTABLE_TOKEN } = process.env;
    const cat = event.queryStringParameters ? event.queryStringParameters.Categoria : null;

    if (!cat) {
        return { statusCode: 400, headers: { "Access-Control-Allow-Origin": "*" }, body: "Falta Categoria" };
    }

    const filter = encodeURIComponent(`AND({Categoria}='${cat}', {Visible})`);
    const options = {
        hostname: 'api.airtable.com',
        path: `/v0/${AIRTABLE_BASE_ID}/Plats?filterByFormula=${filter}`,
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${AIRTABLE_TOKEN}`
        }
    };

    return new Promise((resolve, reject) => {
        const req = https.request(options, (res) => {
            let body = '';
            res.on('data', (d) => body += d);
            res.on('end', () => {
                resolve({
                    statusCode: 200,
                    headers: { 
                        "Content-Type": "application/json", 
                        "Access-Control-Allow-Origin": "*" 
                    },
                    body: JSON.stringify(JSON.parse(body).records || [])
                });
            });
        });

        req.on('error', (e) => {
            resolve({ statusCode: 500, body: "Error Airtable" });
        });
        req.end();
    });
};