const TMDb_API_KEY = 'fc38c65b5f4c1d45172b91795007eed2'; 

const input = document.getElementById('searchInput'); 
const button = document.getElementById('searchBtn'); 
const container = document.getElementById('resultsContainer'); 

button.addEventListener('click', () => {
    const term = input.value.trim();
    if (term) {
        searchMoviesTMDb(term);
    } else {
        alert("Please enter a title to search.");
    }
});


async function searchMoviesTMDb(term) {
    const url = `https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(term)}&api_key=${TMDb_API_KEY}`;
    container.innerHTML = 'Loading results...';

    try {
        const response = await fetch(url);
        
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


function displayTMDbResults(data) {
    container.innerHTML = ''; 
    
    if (data.results && data.results.length > 0) {
        data.results.forEach(movie => {
            const card = document.createElement('div');

            card.classList.add('movie-card'); 
            
            const posterPath = movie.poster_path 
                ? `https://image.tmdb.org/t/p/w200${movie.poster_path}` 
                : 'placeholder.png'; 

            const year = movie.release_date ? movie.release_date.substring(0, 4) : 'N/A';
            
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
