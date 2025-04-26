#Project: Sentiment Analysis and Insights from Uber Customer Reviews Dataset(2024) Project

Group Members: Manjari Bajpai and Vignesh Jothi Karthikeyan



# Installation

You need to write the following commands on the terminal screen so that you can run the project locally.

```sh
1. git clone git@github.com:Mbajpai007/Uber-Review-Analyser.git
2. cd Uber-Review-Analyser
3. npm install
4. npm start
```

The application is running on [localhost](http://localhost:3001).

#How to read Dashboard

1. Rating Distribution Chart
Type: Bar Chart
Purpose: Shows how many reviews fall into each rating category (1 to 5 stars).
X-Axis: Rating (1, 2, 3, 4, 5 stars)
Y-Axis: Number of Reviews
Encoding:
Each bar’s height represents the count of reviews for that rating.
Color may be used to distinguish ratings (e.g., red for low, green for high).
How to Read:
Look at the height of each bar to see which ratings are most common. A taller bar at “5” means most reviews are 5-star.
Idiom:
Bar Chart: Good for comparing discrete categories (here, star ratings).


2. Sentiment Distribution Chart
Type: Pie or Doughnut Chart
Purpose: Shows the proportion of reviews that are positive, neutral, or negative.
Slices: Sentiment categories (Positive, Neutral, Negative)
Encoding:
The size of each slice shows the proportion of reviews in that sentiment.
Color is used to differentiate sentiments (e.g., green for positive, yellow for neutral, red for negative).
How to Read:
Check which slice is largest to see the dominant sentiment. If the green slice is largest, most reviews are positive.
Idiom:
Pie/Doughnut Chart: Good for showing parts of a whole (here, sentiment breakdown).


3. Daily Review Trends Chart
Type: Line Chart
Purpose: Shows how the number of reviews changes over time (by day).
X-Axis: Date (days, usually for a selected month or period)
Y-Axis: Number of Reviews
Encoding:
The position of the line shows the count of reviews for each day.
Peaks and valleys indicate days with more or fewer reviews.
How to Read:
Follow the line to see trends—rising means more reviews, falling means fewer. Spikes may indicate special events or issues.
Idiom:
Line Chart: Good for showing trends and changes over time.


4. Stats Cards
Type: Numeric Summaries
Purpose: Show key metrics at a glance.
Total Reviews: The total number of reviews in the current filter.
Average Rating: The mean rating value.
Sentiment Score: The average sentiment score (often from -1 to 1, or 0 to 1).
Latest Review: The most recent review text.
How to Read:
These are direct numbers—no axes. Use them for a quick summary of the dataset.
Idiom:
Card/Metric Display: Good for highlighting key figures.


5. Recent Reviews List
Type: List
Purpose: Shows the most recent reviews with their details.
Encoding:
Each item shows review text, rating, sentiment, and date.
How to Read:
Read the text for qualitative insights, and check the associated rating/sentiment for context.
Idiom:
List: Good for detailed, item-level inspection.


#Screenshot

![Dashboard Part 1](./data/Screenshot%202025-04-26%20at%2012.52.50%20PM.png)
![Dashboard Part 2](./data/Screenshot%202025-04-26%20at%2012.53.08%20PM.png)
![Dashboard Part 3](./data/Screenshot%202025-04-26%20at%2012.53.22%20PM.png)
