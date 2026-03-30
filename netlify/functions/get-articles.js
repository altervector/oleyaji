exports.handler = async (event) => {
    const cat = event.queryStringParameters.Categoria;
    const BASE_ID = process.env.AIRTABLE_BASE_ID;
    const TOKEN = process.env.AIRTABLE_TOKEN;
    const TABLE_NAME = 'Plats'; 

    if (!cat) {
        return { statusCode: 400, body: JSON.stringify({ error: "Falta Categoria" }) };
    }

    // Filtre: Categoria coincideix i Visible està marcat
    const filter = `AND(LOWER({Categoria})=LOWER('${cat}'), {Visible}=1)`;
    const url = `https://api.airtable.com/v0/${BASE_ID}/${TABLE_NAME}?filterByFormula=${encodeURIComponent(filter)}`;

    try {
        const response = await fetch(url, {
            headers: { 'Authorization': `Bearer ${TOKEN}` }
        });
        const data = await response.json();

        return {
            statusCode: 200,
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*"
            },
            body: JSON.stringify(data)
        };
    } catch (error) {
        return { statusCode: 500, body: JSON.stringify({ error: "Error Airtable" }) };
    }
};
