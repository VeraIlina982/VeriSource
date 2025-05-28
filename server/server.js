
const express = require('express');
const axios = require('axios');
const cors = require('cors');
const app = express();
const port = 5000;

app.use(cors());

app.get('/search', async (req, res) => {
    const { query, year, language, citations } = req.query;
    try {
        const response = await axios.get(`https://core.ac.uk:443/api-v2/articles/search/${query}`, {
            headers: { Authorization: `Bearer YOUR_CORE_API_KEY` }
        });
        const filteredResults = response.data.results.filter(item => {
            return (!year || item.year === parseInt(year)) &&
                   (!language || item.language === language) &&
                   (!citations || item.citations_count >= parseInt(citations));
        });
        res.json(filteredResults);
    } catch (error) {
        res.status(500).json({ error: error.toString() });
    }
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
