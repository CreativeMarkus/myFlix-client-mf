const token = 'YOUR_AUTH_TOKEN';

const movieData = {
    Title: "Inception",
    Description: "A thief who steals corporate secrets through dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.",
    Genre: {
        Name: "Sci-Fi",
        Description: "Science fiction film"
    },
    Director: {
        Name: "Christopher Nolan",
        Bio: "British-American film director",
        Birth: "1970"
    },
    ImagePath: "https://example.com/inception-poster.jpg",
    Featured: true
};

fetch('https://movieapi1-40cbbcb4b0ea.herokuapp.com/movies', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(movieData)
})
    .then(response => response.json())
    .then(data => console.log('Movie added:', data))
    .catch(error => console.error('Error:', error));
