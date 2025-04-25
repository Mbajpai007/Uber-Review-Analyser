// Chart instances
let ratingChart = null;
let sentimentChart = null;
let trendChart = null;

document.addEventListener('DOMContentLoaded', () => {
    // Set current month as default if it's 2024, otherwise set to December 2024
    const monthFilter = document.getElementById('monthFilter');
    const currentDate = new Date();
    const defaultMonth = currentDate.getFullYear() === 2024 
        ? `2024-${(currentDate.getMonth() + 1).toString().padStart(2, '0')}`
        : '2024-12';
    
    monthFilter.value = defaultMonth;
    console.log('Set default month to:', defaultMonth);

    // Add event listeners to filters
    document.getElementById('ratingFilter').addEventListener('change', fetchFilteredData);
    document.getElementById('sentimentFilter').addEventListener('change', fetchFilteredData);
    monthFilter.addEventListener('change', (e) => {
        console.log('Month changed to:', e.target.value);
        fetchFilteredData();
    });

    // Initial data fetch
    fetchFilteredData();
});

function getFilterParameters() {
    const params = {
        rating: document.getElementById('ratingFilter').value,
        sentiment: document.getElementById('sentimentFilter').value,
        month: document.getElementById('monthFilter').value
    };
    console.log('Filter parameters:', params);
    return params;
}

function fetchFilteredData() {
    const filters = getFilterParameters();
    const queryString = new URLSearchParams(filters).toString();
    console.log('Fetching data with query:', queryString);

    Promise.all([
        fetch(`/api/reviews?${queryString}`).then(res => res.json()),
        fetch(`/api/reviews/stats?${queryString}`).then(res => res.json())
    ]).then(([reviews, stats]) => {
        console.log('Received reviews:', reviews.length);
        console.log('Received stats:', stats);
        updateDashboard(reviews, stats);
    }).catch(error => {
        console.error('Error fetching data:', error);
    });
}

function updateDashboard(reviews, stats) {
    // Update summary cards
    document.getElementById('totalReviews').textContent = stats.totalReviews;
    document.getElementById('averageRating').textContent = stats.averageRating;
    
    // Calculate average sentiment
    const avgSentiment = reviews.length > 0 
        ? (reviews.reduce((acc, r) => acc + r.sentiment, 0) / reviews.length).toFixed(2)
        : '0.00';
    document.getElementById('sentimentScore').textContent = avgSentiment;
    
    // Update latest review
    const latestReview = reviews[0];
    if (latestReview) {
        document.getElementById('latestReview').textContent = 
            `${latestReview.comment} (${latestReview.rating}★)`;
    } else {
        document.getElementById('latestReview').textContent = 'No reviews available';
    }

    // Update or create rating distribution chart
    const ratingCtx = document.getElementById('ratingChart').getContext('2d');
    if (ratingChart) {
        ratingChart.destroy();
    }
    ratingChart = new Chart(ratingCtx, {
        type: 'bar',
        data: {
            labels: ['5 Stars', '4 Stars', '3 Stars', '2 Stars', '1 Star'],
            datasets: [{
                label: 'Number of Reviews',
                data: [
                    stats.ratingDistribution[5],
                    stats.ratingDistribution[4],
                    stats.ratingDistribution[3],
                    stats.ratingDistribution[2],
                    stats.ratingDistribution[1]
                ],
                backgroundColor: [
                    '#28a745',
                    '#5cb85c',
                    '#ffc107',
                    '#fd7e14',
                    '#dc3545'
                ]
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        stepSize: 1
                    }
                }
            }
        }
    });

    // Update or create sentiment distribution chart
    const sentimentCtx = document.getElementById('sentimentChart').getContext('2d');
    if (sentimentChart) {
        sentimentChart.destroy();
    }
    sentimentChart = new Chart(sentimentCtx, {
        type: 'pie',
        data: {
            labels: ['Positive', 'Neutral', 'Negative'],
            datasets: [{
                data: [
                    stats.sentimentDistribution.positive,
                    stats.sentimentDistribution.neutral,
                    stats.sentimentDistribution.negative
                ],
                backgroundColor: [
                    '#28a745',
                    '#ffc107',
                    '#dc3545'
                ]
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'right'
                }
            }
        }
    });

    // Update or create monthly trend chart
    const trendCtx = document.getElementById('trendChart').getContext('2d');
    if (trendChart) {
        trendChart.destroy();
    }

    // Convert monthly data to arrays and ensure all months are represented
    const monthLabels = [
        'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
        'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];

    const monthlyData = monthLabels.map((_, index) => {
        const month = `2024-${(index + 1).toString().padStart(2, '0')}`;
        return stats.monthlyReviews[month] || 0;
    });

    trendChart = new Chart(trendCtx, {
        type: 'line',
        data: {
            labels: monthLabels,
            datasets: [{
                label: 'Monthly Reviews (2024)',
                data: monthlyData,
                borderColor: '#007bff',
                tension: 0.1,
                fill: false
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        stepSize: 1
                    }
                }
            }
        }
    });

    // Populate reviews list
    const reviewsList = document.getElementById('reviewsList');
    if (reviews.length === 0) {
        reviewsList.innerHTML = '<div class="list-group-item">No reviews found for the selected filters</div>';
    } else {
        reviewsList.innerHTML = reviews.map(review => `
            <div class="list-group-item">
                <div class="d-flex justify-content-between align-items-center">
                    <span class="rating-badge rating-${review.rating}">${review.rating}★</span>
                    <small class="text-muted">${review.date}</small>
                </div>
                <p class="mb-1">${review.comment}</p>
                <div class="d-flex justify-content-between align-items-center">
                    <small class="text-muted">User: ${review.userName}</small>
                    <small class="text-muted">Sentiment: ${review.sentiment > 0 ? 'Positive' : review.sentiment < 0 ? 'Negative' : 'Neutral'}</small>
                </div>
                ${review.replyContent ? `
                    <div class="mt-2 p-2 bg-light rounded">
                        <small class="text-muted">Reply (${review.repliedAt}):</small>
                        <p class="mb-0">${review.replyContent}</p>
                    </div>
                ` : ''}
            </div>
        `).join('');
    }
} 