const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

exports.handler = async (event) => {
    const cat = event.queryStringParameters.Categoria;
    const { AIRTABLE_BASE_ID, AIRTABLE_TOKEN } = process.env;
    const TABLE_NAME = 'Plats'; 

    if (!cat) return { statusCode: 400, body: "Falta Categoria" };

    // Filtre: Vigila que a Airtable la columna es digui "Categoria" i "Visible"
    const filter = `AND(LOWER({Categoria})=LOWER('${cat}'), {Visible}=1)`;
    const url = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${TABLE_NAME}?filterByFormula=${encodeURIComponent(filter)}`;

    try {
        const response = await fetch(url, {
            headers: { 
                "Authorization": `Bearer ${AIRTABLE_TOKEN}`,
                "Content-Type": "application/json"
            }
        });

        const data = await response.json();

        // Si Airtable torna un error (per exemple, nom de columna malament)
        if (data.error) {
            console.error("Error d'Airtable:", data.error);
            return { statusCode: 500, body: JSON.stringify(data.error) };
        }

        return {
            statusCode: 200,
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*"
            },
            body: JSON.stringify(data.records || [])
        };
    } catch (e) {
        return { statusCode: 500, body: "Error de xarxa" };
    }
};
