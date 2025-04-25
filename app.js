/*

GEREKLİ PAKETLER YÜKLENİYOR...

*/
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const { loadReviews, getFilteredReviews, getReviewStats } = require('./data/reviews');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Load reviews data when server starts
let reviewsLoaded = false;
loadReviews()
    .then(() => {
        reviewsLoaded = true;
        console.log('Reviews data loaded successfully');
    })
    .catch(error => {
        console.error('Error loading reviews:', error);
    });

// API Routes
app.get('/api/reviews', (req, res) => {
    if (!reviewsLoaded) {
        return res.status(503).json({ error: 'Reviews data is still loading' });
    }

    const filters = {
        rating: req.query.rating,
        sentiment: req.query.sentiment,
        month: req.query.month
    };

    const filteredReviews = getFilteredReviews(filters);
    res.json(filteredReviews);
});

app.get('/api/reviews/stats', (req, res) => {
    if (!reviewsLoaded) {
        return res.status(503).json({ error: 'Reviews data is still loading' });
    }

    const filters = {
        rating: req.query.rating,
        sentiment: req.query.sentiment,
        month: req.query.month
    };

    const filteredReviews = getFilteredReviews(filters);
    const stats = getReviewStats(filteredReviews);
    res.json(stats);
});

// Serve the main HTML file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
