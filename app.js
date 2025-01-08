const express = require('express');
const axios = require('axios');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.static(path.join(__dirname, 'public'))); // Servir archivos estáticos

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

// Palabras clave relacionadas con criptomonedas
const cryptoKeywords = ['blockchain', 'crypto', 'ethereum', 'solana', 'token', 'defi', 'web3', 'nft', 'wallet', 'smart contract'];

// Clasifica los repositorios por categoría
function classifyRepo(description = '') {
    const lowerDescription = description.toLowerCase(); // Convierte a minúsculas para comparación

    if (lowerDescription.includes('wallet')) return 'Wallet';
    if (lowerDescription.includes('nft')) return 'NFT';
    if (lowerDescription.includes('defi')) return 'DeFi';
    if (lowerDescription.includes('smart contract')) return 'Smart Contract';
    if (lowerDescription.includes('blockchain')) return 'Blockchain General';
    if (lowerDescription.includes('crypto')) return 'Crypto General';

    // Si no coincide, asigna una categoría aleatoria
    const categories = ['Wallet', 'NFT', 'DeFi', 'Smart Contract', 'Blockchain General', 'Crypto General'];
    return categories[Math.floor(Math.random() * categories.length)];
}


// Endpoint para buscar y analizar repositorios
app.get('/repos', async (req, res) => {
    const { page = 1, query = 'blockchain+crypto' } = req.query;
    const url = `https://api.github.com/search/repositories?q=${query}+stars:>50&sort=stars&order=desc&per_page=6&page=${page}`;

    try {
        const response = await axios.get(url, {
            headers: {
                'Authorization': `token ${GITHUB_TOKEN}`,
                'User-Agent': 'CryptoGitHubDashboard',
            },
        });

        const analyzedRepos = response.data.items.map(repo => ({
            name: repo.name,
            description: repo.description || 'Sin descripción',
            stars: repo.stargazers_count,
            forks: repo.forks_count,
            url: repo.html_url,
            owner: repo.owner.login,
            ownerProfile: repo.owner.html_url, // Enlace al perfil del dueño
            category: classifyRepo(repo.description), // Clasificar el repositorio
        }));

        res.json(analyzedRepos);
    } catch (error) {
        console.error('Error al obtener datos de GitHub:', error.response?.data || error.message);
        res.status(500).send('Error al obtener datos de GitHub');
    }
});



app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
