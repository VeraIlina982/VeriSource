# VeriSource
Вебзастосунок д// === Структура папок ===
// VeriSource/
// ├── client/ (React фронтенд)
// └── server/ (Node.js бекенд)

// === server/server.js ===
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

// === client/App.js ===
import React, { useState } from 'react';
import axios from 'axios';
import { saveAs } from 'file-saver';

function App() {
    const [query, setQuery] = useState('');
    const [year, setYear] = useState('');
    const [language, setLanguage] = useState('');
    const [citations, setCitations] = useState('');
    const [results, setResults] = useState([]);

    const search = async () => {
        const response = await axios.get('http://localhost:5000/search', {
            params: { query, year, language, citations }
        });
        setResults(response.data);
    };

    const exportResults = () => {
        const csvContent = results.map(item => `${item.title},${item.year},${item.language},${item.citations_count}`).join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        saveAs(blob, 'results.csv');
    };

    return (
        <div>
            <h1>VeriSource</h1>
            <input placeholder="Тема" value={query} onChange={e => setQuery(e.target.value)} />
            <input placeholder="Рік" value={year} onChange={e => setYear(e.target.value)} />
            <input placeholder="Мова" value={language} onChange={e => setLanguage(e.target.value)} />
            <input placeholder="Кількість цитувань" value={citations} onChange={e => setCitations(e.target.value)} />
            <button onClick={search}>Пошук</button>
            <button onClick={exportResults}>Експортувати</button>
            <ul>
                {results.map(item => (
                    <li key={item.id}>{item.title} ({item.year}) - {item.language} - {item.citations_count} цитувань</li>
                ))}
            </ul>
        </div>
    );
}

export default App;

// === README.md ===
# VeriSource

VeriSource – додаток для журналістів для пошуку та перевірки наукових джерел з використанням CORE API.

## Запуск
1. Встановіть залежності:
   - Сервер: `cd server && npm install`
   - Клієнт: `cd client && npm install`
2. Запустіть сервер: `node server.js`
3. Запустіть клієнт: `npm start`

## Налаштування
- Замініть `YOUR_CORE_API_KEY` у `server.js` на свій ключ.

## Функціонал
- Пошук за ключовими словами.
- Фільтрація за роками, мовами, цитуваннями.
- Експорт результатів.

## Технології
- React, Node.js, CORE API, Vercel.
ля журналістів, створений для автоматизації пошуку, перевірки та документування достовірної наукової інформації. 
