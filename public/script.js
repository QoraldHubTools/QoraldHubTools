let currentPage = 1;
let currentQuery = 'blockchain+crypto';

const searchInput = document.getElementById('searchQuery');
const searchButton = document.getElementById('searchButton');

async function loadRepos(reset = false) {
    const reposContainer = document.getElementById('repos');
    const loadMoreButton = document.getElementById('loadMore');
    loadMoreButton.disabled = true; 
    if (reset) {
        reposContainer.innerHTML = '';
        currentPage = 1;
    }

    try {
        const response = await fetch(`/repos?page=${currentPage}&query=${encodeURIComponent(currentQuery)}`);
        const repos = await response.json();

        if (repos.length === 0 && reset) {
            reposContainer.innerHTML = '<p>There`s no repositories..</p>';
        }

        repos.forEach(repo => {
            const repoElement = document.createElement('div');
            repoElement.classList.add('repo');
            repoElement.innerHTML = `
                <h3>${repo.name}</h3>
                <p>${repo.description || 'No description available.'}</p>
                <p>
                    <strong>Owner:</strong> 
                    <a href="${repo.ownerProfile}" target="_blank">${repo.owner}</a>
                </p>
                <p><strong>Type:</strong> ${repo.category}</p>
                <p>⭐ ${repo.stars} | 🍴 ${repo.forks}</p>
                <a href="${repo.url}" target="_blank">See on GitHub</a>
                <a href="https://www.google.com/search?q=${repo.name}+${repo.owner}" target="_blank" class="check-link">
                    Find if this repository was used previuosly.
                </a>
            `;
            reposContainer.appendChild(repoElement);
        });

        currentPage++;
        loadMoreButton.disabled = false; 
    } catch (error) {
        console.error('Error to load repositories:', error);
        alert('Error to load repositories.');
    }
}

function performSearch() {
    const searchQuery = searchInput.value.trim();
    currentQuery = searchQuery || 'blockchain+crypto'; 
    loadRepos(true); 
}

searchButton.addEventListener('click', performSearch);

searchInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        performSearch();
    }
});

document.getElementById('loadMore').addEventListener('click', () => loadRepos());

window.onload = () => loadRepos(true);
