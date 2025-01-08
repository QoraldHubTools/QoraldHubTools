const express = require('express');
const axios = require('axios');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.static(path.join(__dirname, 'public'))); 

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

const cryptoKeywords = ['blockchain', 'crypto', 'ethereum', 'solana', 'token', 'defi', 'web3', 'nft', 'wallet', 'smart contract'];

function classifyRepo(description = '') {
    const lowerDescription = description.toLowerCase(); 

    if (lowerDescription.includes('wallet')) return 'Wallet';
    if (lowerDescription.includes('ai')) return 'Agent AI';
    if (lowerDescription.includes('defi')) return 'DeFi';
    if (lowerDescription.includes('smart contract')) return 'Smart Contract';
    if (lowerDescription.includes('blockchain')) return 'Blockchain';
    if (lowerDescription.includes('crypto')) return 'Crypto';

    const categories = ['Wallet', 'Agent AI', 'DeFi', 'Smart Contract', 'Blockchain General', 'Crypto General'];
    return categories[Math.floor(Math.random() * categories.length)];
}


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
            description: repo.description || 'No Found',
            stars: repo.stargazers_count,
            forks: repo.forks_count,
            url: repo.html_url,
            owner: repo.owner.login,
            ownerProfile: repo.owner.html_url, 
            category: classifyRepo(repo.description), 
        }));

        res.json(analyzedRepos);
    } catch (error) {
        console.error('Error to get Github data:', error.response?.data || error.message);
        res.status(500).send('Error to get Github data');
    }
});



app.listen(PORT, () => {
    console.log(`Server running http://localhost:${PORT}`);
});
