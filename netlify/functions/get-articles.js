const fetch = require('node-fetch');

exports.handler = async (event) => {
    const cat = event.queryStringParameters ? event.queryStringParameters.Categoria : null;
    const { AIRTABLE_BASE_ID, AIRTABLE_TOKEN } = process.env;

    if (!cat) {
        return { 
            statusCode: 400, 
            headers: { "Access-Control-Allow-Origin": "*" },
            body: JSON.stringify({ error: "Falta Categoria" }) 
        };
    }

    const filter = `AND({Categoria}='${cat}', {Visible}=1)`;
    const url = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/Plats?filterByFormula=${encodeURIComponent(filter)}`;

    try {
        const response = await fetch(url, {
            headers: { Authorization: `Bearer ${AIRTABLE_TOKEN}` }
        });
        const data = await response.json();

        // Enviem només la llista de registres per simplificar el JS frontal
        return {
            statusCode: 200,
            headers: { 
                "Content-Type": "application/json", 
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Headers": "Content-Type"
            },
            body: JSON.stringify(data.records || [])
        };
    } catch (e) {
        return { 
            statusCode: 500, 
            headers: { "Access-Control-Allow-Origin": "*" },
            body: JSON.stringify({ error: "Error Airtable" }) 
        };
    }
};