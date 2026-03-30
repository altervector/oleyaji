exports.handler = async (event) => {
    // 1. Agafem la Categoria de la URL
    const cat = event.queryStringParameters.Categoria;
    const { AIRTABLE_BASE_ID, AIRTABLE_TOKEN } = process.env;
    const TABLE_NAME = 'Plats'; // <--- Nom de la pestanya a Airtable

    if (!cat) return { statusCode: 400, body: "Falta Categoria" };

    // 2. Filtre: Coincideix categoria i el xec de "Visible" està marcat
    const filter = `AND(LOWER({Categoria})=LOWER('${cat}'), {Visible}=1)`;
    const url = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${TABLE_NAME}?filterByFormula=${encodeURIComponent(filter)}`;

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
        return { statusCode: 500, body: "Error de connexió amb Airtable" };
    }
};
