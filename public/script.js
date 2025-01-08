let currentPage = 1;
let currentQuery = 'blockchain+crypto';

const searchInput = document.getElementById('searchQuery');
const searchButton = document.getElementById('searchButton');

// Función para cargar repositorios
async function loadRepos(reset = false) {
    const reposContainer = document.getElementById('repos');
    const loadMoreButton = document.getElementById('loadMore');
    loadMoreButton.disabled = true; // Deshabilitar el botón mientras se cargan datos

    if (reset) {
        reposContainer.innerHTML = ''; // Limpia los repositorios si es una nueva búsqueda
        currentPage = 1; // Reinicia la página
    }

    try {
        const response = await fetch(`/repos?page=${currentPage}&query=${encodeURIComponent(currentQuery)}`);
        const repos = await response.json();

        if (repos.length === 0 && reset) {
            reposContainer.innerHTML = '<p>No se encontraron repositorios.</p>';
        }

        repos.forEach(repo => {
            const repoElement = document.createElement('div');
            repoElement.classList.add('repo');
            repoElement.innerHTML = `
                <h3>${repo.name}</h3>
                <p>${repo.description || 'Sin descripción disponible'}</p>
                <p>
                    <strong>Dueño:</strong> 
                    <a href="${repo.ownerProfile}" target="_blank">${repo.owner}</a>
                </p>
                <p><strong>Categoría:</strong> ${repo.category}</p>
                <p>⭐ ${repo.stars} | 🍴 ${repo.forks}</p>
                <a href="${repo.url}" target="_blank">Ver en GitHub</a>
                <a href="https://www.google.com/search?q=${repo.name}+${repo.owner}" target="_blank" class="check-link">
                    Buscar si se ha utilizado en algún proyecto
                </a>
            `;
            reposContainer.appendChild(repoElement);
        });

        currentPage++;
        loadMoreButton.disabled = false; // Habilitar el botón nuevamente
    } catch (error) {
        console.error('Error al cargar repositorios:', error);
        alert('Error al cargar repositorios.');
    }
}

// Función de búsqueda
function performSearch() {
    const searchQuery = searchInput.value.trim();
    currentQuery = searchQuery || 'blockchain+crypto'; // Si está vacío, usa la consulta por defecto
    loadRepos(true); // Realizar nueva búsqueda
}

// Manejo del botón "Buscar"
searchButton.addEventListener('click', performSearch);

// Manejo del Enter en el campo de búsqueda
searchInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        performSearch();
    }
});

// Manejo del botón "Cargar más"
document.getElementById('loadMore').addEventListener('click', () => loadRepos());

// Cargar repositorios automáticamente al cargar la página
window.onload = () => loadRepos(true);
