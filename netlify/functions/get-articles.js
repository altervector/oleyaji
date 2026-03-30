exports.handler = async (event) => {
    const cat = event.queryStringParameters.Categoria;
    const { AIRTABLE_BASE_ID, AIRTABLE_TOKEN } = process.env;

    if (!cat) return { statusCode: 400, body: "Falta Categoria" };

    // Filtre exacte per als teus noms de columna
    const filter = `AND({Categoria}='${cat}', {Visible}=1)`;
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
        return { statusCode: 500, body: "Error Airtable" };
    }
};