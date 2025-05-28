
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
