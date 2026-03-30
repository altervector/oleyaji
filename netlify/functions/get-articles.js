exports.handler = async (event) => {
    const { Categoria } = event.queryStringParameters;
    const BASE_ID = process.env.AIRTABLE_BASE_ID;
    const TOKEN = process.env.AIRTABLE_TOKEN;

    if (!Categoria) {
        return { statusCode: 400, body: JSON.stringify({ error: "Falta Categoria" }) };
    }

    // Filtre directe: Compara el text i avalua el Checkbox
    const filter = `AND({Categoria}='${Categoria}', {Visible})`;
    const url = `https://api.airtable.com/v0/${BASE_ID}/Plats?filterByFormula=${encodeURIComponent(filter)}`;

    try {
        const response = await fetch(url, {
            headers: { 
                'Authorization': `Bearer ${TOKEN}`,
                'Content-Type': 'application/json'
            }
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
        return { statusCode: 500, body: JSON.stringify({ error: "Error de servidor" }) };
    }
};