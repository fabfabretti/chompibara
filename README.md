# Chompibara

Chompibara is a food tracking application built with React, designed to help users monitor their nutrition by uploading photos of their meals and manually adding nutritional information. It offers a daily food diary, with visual charts to track calorie and macro consumption.

Chompibara is an educational project, created for learning purposes, as part of a university React course.

## Features

- **Meal Photo Upload**: Users can capture or upload a photo of their meals.
- **Manual Edit**: Users can add new meals with corresponding nutritional values manually.
- **Daily Meal Log**: A list of meals with nutritional details displayed in a daily log.
- **Nutritional Statistics**: Graphs and charts showing daily calories and macronutrient consumption (carbs, fats, proteins).
- **Meal Types**: Categorize meals as breakfast, lunch, dinner, or snacks for better organization.

## Installation

To run the app locally, follow these steps:

1. Clone the repository

```bash
git clone https://github.com/your-username/chompibara.git
cd chompibara
```

2. Install dependencies

Make sure you have Node.js and npm installed; the project was developed on Node.js version `20.18.1`. Then, run:

```bash
npm install
```

3. Environment Setup

You will need to set up Supabase for backend storage. Create an .env file in the root of the project and include your Supabase credentials:

```bash
REACT_APP_SUPABASE_URL=your_supabase_url
REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key
```

Please note that, in its current version, the project does not handle RLS policies. Hence, the Supabase database must have them disabled or all queries will return 0 rows.

4. Start the app

Once everything is set up, you can start the development server:

```bash
npm start dev
```

This will start the app on http://localhost:5173 by default.

## Technologies Used

- **React+Typescript**: The core library for building the user interface.
- **Supabase**: For managing the database and handling authentication.
- **Font Awesome**: For icons throughout the app.
- **Chart.js**: A simple yet effective library for creating smooth, interactive, and visually appealing custom charts.
