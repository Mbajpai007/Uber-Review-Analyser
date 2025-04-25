const fs = require('fs');
const path = require('path');
const moment = require('moment');
const csv = require('csv-parser');
const Sentiment = require('sentiment');
const sentiment = new Sentiment();

let reviews = [];

// Read and parse the CSV file
function loadReviews() {
    return new Promise((resolve, reject) => {
        const results = [];
        fs.createReadStream(path.join(__dirname, 'DownloadedData.csv'))
            .pipe(csv())
            .on('data', (data) => {
                // Parse the datetime string
                const reviewDate = moment(data.at, 'YYYY-MM-DD HH:mm:ss');
                
                // Only include valid dates from 2024
                if (reviewDate.isValid() && reviewDate.year() === 2024) {
                    const sentimentResult = sentiment.analyze(data.content);
                    const review = {
                        id: results.length + 1,
                        rating: parseInt(data.score),
                        comment: data.content,
                        date: reviewDate.format('YYYY-MM-DD'),
                        dateTime: data.at, // Keep original datetime for reference
                        userName: data.userName,
                        appVersion: data.appVersion,
                        thumbsUp: parseInt(data.thumbsUpCount) || 0,
                        replyContent: data.replyContent || null,
                        repliedAt: data.repliedAt ? moment(data.repliedAt, 'YYYY-MM-DD HH:mm:ss').format('YYYY-MM-DD') : null,
                        sentiment: sentimentResult.score,
                        sentimentComparative: sentimentResult.comparative
                    };
                    results.push(review);
                }
            })
            .on('end', () => {
                reviews = results.sort((a, b) => moment(b.dateTime).valueOf() - moment(a.dateTime).valueOf());
                
                // Log distribution of reviews by month
                const monthCounts = {};
                reviews.forEach(review => {
                    const month = moment(review.date).format('YYYY-MM');
                    monthCounts[month] = (monthCounts[month] || 0) + 1;
                });
                console.log('Reviews by month:', monthCounts);
                
                resolve(reviews);
            })
            .on('error', (error) => {
                reject(error);
            });
    });
}

function getFilteredReviews(filters = {}) {
    let filteredReviews = [...reviews];
    console.log(`Initial reviews count: ${filteredReviews.length}`);

    // Apply rating filter
    if (filters.rating) {
        filteredReviews = filteredReviews.filter(review => review.rating === parseInt(filters.rating));
        console.log(`After rating filter (${filters.rating}): ${filteredReviews.length} reviews`);
    }

    // Apply sentiment filter
    if (filters.sentiment) {
        switch (filters.sentiment) {
            case 'positive':
                filteredReviews = filteredReviews.filter(review => review.sentiment > 0);
                break;
            case 'negative':
                filteredReviews = filteredReviews.filter(review => review.sentiment < 0);
                break;
            case 'neutral':
                filteredReviews = filteredReviews.filter(review => review.sentiment === 0);
                break;
        }
        console.log(`After sentiment filter (${filters.sentiment}): ${filteredReviews.length} reviews`);
    }

    // Apply month filter (2024 only)
    if (filters.month) {
        console.log(`Filtering for month: ${filters.month}`);
        filteredReviews = filteredReviews.filter(review => {
            const reviewMonth = moment(review.date).format('YYYY-MM');
            console.log(`Comparing review month ${reviewMonth} with filter ${filters.month}`);
            return reviewMonth === filters.month;
        });
        console.log(`After month filter (${filters.month}): ${filteredReviews.length} reviews`);
        
        // Log some sample reviews for debugging
        if (filteredReviews.length > 0) {
            console.log('Sample filtered reviews:', filteredReviews.slice(0, 3));
        }
    }

    return filteredReviews;
}

function getReviewStats(filteredReviews = reviews) {
    const totalReviews = filteredReviews.length;
    const averageRating = totalReviews > 0 
        ? (filteredReviews.reduce((acc, review) => acc + review.rating, 0) / totalReviews).toFixed(2)
        : 0;
    
    const ratingDistribution = {
        5: filteredReviews.filter(r => r.rating === 5).length,
        4: filteredReviews.filter(r => r.rating === 4).length,
        3: filteredReviews.filter(r => r.rating === 3).length,
        2: filteredReviews.filter(r => r.rating === 2).length,
        1: filteredReviews.filter(r => r.rating === 1).length
    };

    const sentimentDistribution = {
        positive: filteredReviews.filter(r => r.sentiment > 0).length,
        neutral: filteredReviews.filter(r => r.sentiment === 0).length,
        negative: filteredReviews.filter(r => r.sentiment < 0).length
    };

    // Get monthly review counts for 2024
    const monthlyReviews = {};
    // Initialize all months with 0
    for (let month = 1; month <= 12; month++) {
        const monthKey = `2024-${month.toString().padStart(2, '0')}`;
        monthlyReviews[monthKey] = 0;
    }
    
    // Update counts from actual reviews
    filteredReviews.forEach(review => {
        const month = moment(review.date).format('YYYY-MM');
        if (month.startsWith('2024')) {
            monthlyReviews[month] = (monthlyReviews[month] || 0) + 1;
        }
    });

    return {
        totalReviews,
        averageRating,
        ratingDistribution,
        sentimentDistribution,
        monthlyReviews
    };
}

module.exports = {
    loadReviews,
    getFilteredReviews,
    getReviewStats
}; 