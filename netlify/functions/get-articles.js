const fetch = require('node-fetch');

exports.handler = async (event) => {
    const cat = event.queryStringParameters ? event.queryStringParameters.Categoria : null;
    const { AIRTABLE_BASE_ID, AIRTABLE_TOKEN } = process.env;

    // Si falta la categoria a la URL, enviem el 400
    if (!cat) return { statusCode: 400, headers: { "Access-Control-Allow-Origin": "*" }, body: "Falta Categoria" };

    // FILTRE PER A CHECKBOX: Si el check està marcat, {Visible} és cert
    const filter = `AND({Categoria}='${cat}', {Visible})`;
    const url = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/Plats?filterByFormula=${encodeURIComponent(filter)}`;

    try {
        const response = await fetch(url, {
            headers: { Authorization: `Bearer ${AIRTABLE_TOKEN}` }
        });
        const data = await response.json();

        return {
            statusCode: 200,
            headers: { 
                "Content-Type": "application/json", 
                "Access-Control-Allow-Origin": "*" 
            },
            body: JSON.stringify(data.records || [])
        };
    } catch (e) {
        console.error("Error Airtable:", e);
        return { statusCode: 500, headers: { "Access-Control-Allow-Origin": "*" }, body: "Error Airtable" };
    }
};