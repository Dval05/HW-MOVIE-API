// ** STEP 0: REPLACE THIS WITH YOUR TMDb API Key (v3 auth) **
const TMDb_API_KEY = 'fc38c65b5f4c1d45172b91795007eed2'; 

// Get DOM elements (using names that match the English HTML)
const input = document.getElementById('searchInput'); // Was 'busquedaInput'
const button = document.getElementById('searchBtn'); // Was 'buscarBtn'
const container = document.getElementById('resultsContainer'); // Was 'resultadosContainer'

button.addEventListener('click', () => {
    const term = input.value.trim();
    if (term) {
        searchMoviesTMDb(term);
    } else {
        alert("Please enter a title to search.");
    }
});

/**
 * Function to perform the search using the TMDb API.
 * @param {string} term - The search query.
 */
async function searchMoviesTMDb(term) {
    // 1. Build the URL with 'query' and 'api_key' parameters
    const url = `https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(term)}&api_key=${TMDb_API_KEY}`;
    container.innerHTML = 'Loading results...';

    try {
        const response = await fetch(url);
        
        // Check for HTTP errors (e.g., 404, 500)
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();

        displayTMDbResults(data);

    } catch (error) {
        container.innerHTML = '<p class="message error">Error connecting to TMDb API. Please check the console for details.</p>';
        console.error("Error with TMDb API:", error);
    }
}

/**
 * Function to process and display the JSON response from TMDb.
 * @param {Object} data - The JSON response object from the API.
 */
function displayTMDbResults(data) {
    container.innerHTML = ''; // Clear previous results

    // TMDb results are in the 'results' field
    if (data.results && data.results.length > 0) {
        data.results.forEach(movie => {
            const card = document.createElement('div');
            // Using the modern class name from the improved CSS
            card.classList.add('movie-card'); 
            
            // TMDb uses relative paths for images. We need the base path.
            const posterPath = movie.poster_path 
                ? `https://image.tmdb.org/t/p/w200${movie.poster_path}` // Base URL for images
                : 'placeholder.png'; 

            // Extract the year (or 'N/A')
            const year = movie.release_date ? movie.release_date.substring(0, 4) : 'N/A';
            
            // Format the vote average
            const rating = movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A';

            card.innerHTML = `
                <img src="${posterPath}" alt="${movie.title} Poster">
                <h2>${movie.title} (${year})</h2>
                <p>Rating: ${rating}</p>
            `;
            container.appendChild(card);
        });
    } else {
        container.innerHTML = `<p class="message">No results found for "${input.value}" on TMDb.</p>`;
    }
}