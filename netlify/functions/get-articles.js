exports.handler = async (event) => {
    // 1. Agafem la categoria de la URL (ex: ?Categoria=Begudes)
    const cat = event.queryStringParameters ? event.queryStringParameters.Categoria : null;
    const { AIRTABLE_BASE_ID, AIRTABLE_TOKEN } = process.env;

    // Si no hi ha categoria, donem error 400
    if (!cat) {
        return { 
            statusCode: 400, 
            body: JSON.stringify({ error: "Falta la Categoria" }) 
        };
    }

    // 2. Construïm el filtre per a Airtable (sense accents, com em vas dir)
    // Busquem que la columna 'Categoria' sigui igual a la que rebem i que 'Visible' sigui 1
    const filter = `AND({Categoria}='${cat}', {Visible}=1)`;
    const url = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/Plats?filterByFormula=${encodeURIComponent(filter)}`;

    try {
        const response = await fetch(url, {
            headers: { Authorization: `Bearer ${AIRTABLE_TOKEN}` }
        });
        
        const data = await response.json();

        // 3. Retornem els registres (records) trobats
        return {
            statusCode: 200,
            headers: { 
                "Content-Type": "application/json", 
                "Access-Control-Allow-Origin": "*" 
            },
            body: JSON.stringify(data.records || [])
        };
    } catch (e) {
        return { 
            statusCode: 500, 
            body: JSON.stringify({ error: "Error Airtable" }) 
        };
    }
};