# Chompibara documentation

## 1. What is Chompibara

Chompibara is a food tracking application built with  React, designed to help users monitor their nutrition by uploading  photos of their meals and manually adding nutritional information. It  offers a daily food diary, with visual charts to track calorie and macro consumption.

Chompibara is an educational project, created for learning purposes, as part of a university React course.

This project is licensed under the AGPL Affero Gnu Public License 3.0, and its source code is available [here](https://github.com/fabfabretti/chompibara).

### Key features

* **Meal Tracking**: Users can add, update, and delete meals, including details like calories, macronutrients, and meal type. They can also add an image to visually represent their meal, and categorize them by their tipe (e.g. lunch, dinner)

* **Exercise Tracking**: Users can log basic exercises data, including details like calories burned, duration, and exercise type.

* **Profile Management**: Users can update their profile information, including height, weight, age, and target macros/calories. 

* **History and Stats**: Users can view their recorder meal for each day, and have an aesthetically pleasing dashboard informing them of their macronutrient and calories intake throughout the day, There is also a different page to get similar information throughout a personalized time period, to visualize longer trernds and improvements.

## Installation

### 1. Supabase setup and schema

As this project uses [Supabase](https://supabase.com/) as its backend/database, it is necessary first of all to setup a Supabase project if the original one has not been passed down by the author. At the moment of writing, the original database has not been setup for public or extended use, as this is would be beyond the scope of the project; row-level security policies will need to be set up in order to expand the project further.

The project makes use of the following tables:

* `ExerciseDB`
  ![image-20250322184706993](Documentation.assets/image-20250322184706993.png)

* `MealDataDB`
  ![image-20250322184752303](Documentation.assets/image-20250322184752303.png)

* `ProfileDB`

  Currently, Chompibara only supports and uses a single user. However, a database table has been set up to allow multi-user development in the future.
  ![image-20250322184848913](Documentation.assets/image-20250322184848913.png)

The white dot on the settings cog indicates that the value is nullable.

Furthermore, the images uploaded by the user are saved onto a Storage bucket called `meal-images` , and the database's "image" column contains a link to the image inside the storage.

It is possible to auto-fill with syntetic a week worth's of data with the follwing SQL query inside the SQL editor in Supabase. Please keep in mind that the URL for the images will need to be filled with a real url.

```SQL
INSERT INTO public."MealDataDB" (photo, title, date, time, mealtype, calories, carbos, protein, fats)
VALUES
  -- Giorno 1
  (<IMAGE URL>, 'Pancakes con sciroppo d acero', CURRENT_DATE, '08:00:00', 'Breakfast', 400, 50, 10, 12),
  (<IMAGE URL>, 'Insalata di pollo e avocado', CURRENT_DATE, '13:00:00', 'Lunch', 750, 40, 45, 30),
  (<IMAGE URL>, 'Salmone al forno con verdure', CURRENT_DATE, '19:30:00', 'Dinner', 650, 35, 50, 25),
  (<IMAGE URL>, 'Mandorle e yogurt greco', CURRENT_DATE, '16:00:00', 'Snack', 200, 10, 15, 10),
  
  -- Giorno 2
  (<IMAGE URL>, 'Uova strapazzate con toast integrale', CURRENT_DATE + 1, '08:00:00', 'Breakfast', 450, 35, 20, 15),
  (<IMAGE URL>, 'Pasta al pesto con pollo', CURRENT_DATE + 1, '13:00:00', 'Lunch', 800, 65, 45, 35),
  (<IMAGE URL>, 'Zuppa di lenticchie e pane di segale', CURRENT_DATE + 1, '19:30:00', 'Dinner', 550, 50, 30, 12),
  (<IMAGE URL>, 'Frutta secca e cioccolato fondente', CURRENT_DATE + 1, '16:00:00', 'Snack', 250, 15, 12, 18),
  
  -- Giorno 3
  (<IMAGE URL>, 'Smoothie alla banana e avena', CURRENT_DATE + 2, '08:00:00', 'Breakfast', 350, 50, 12, 8),
  (<IMAGE URL>, 'Quinoa con ceci e verdure', CURRENT_DATE + 2, '13:00:00', 'Lunch', 700, 75, 30, 20),
  (<IMAGE URL>, 'Bistecca con insalata mista', CURRENT_DATE + 2, '19:30:00', 'Dinner', 750, 25, 60, 35),
  (<IMAGE URL>, 'Barretta proteica', CURRENT_DATE + 2, '16:00:00', 'Snack', 200, 25, 15, 5),
  
  -- Giorno 4
  (<IMAGE URL>, 'Yogurt con granola e frutti di bosco', CURRENT_DATE + 3, '08:00:00', 'Breakfast', 320, 40, 15, 10),
  (<IMAGE URL>, 'Burger di tacchino con patate dolci', CURRENT_DATE + 3, '13:00:00', 'Lunch', 750, 60, 50, 25),
  (<IMAGE URL>, 'Orata al forno con riso', CURRENT_DATE + 3, '19:30:00', 'Dinner', 650, 55, 45, 18),
  (<IMAGE URL>, 'Mela con burro di arachidi', CURRENT_DATE + 3, '16:00:00', 'Snack', 280, 30, 10, 15),
  
  -- Giorno 5
  (<IMAGE URL>, 'Toast con avocado e uovo', CURRENT_DATE + 4, '08:00:00', 'Breakfast', 450, 40, 18, 15),
  (<IMAGE URL>, 'Couscous con verdure e feta', CURRENT_DATE + 4, '13:00:00', 'Lunch', 700, 75, 25, 22),
  (<IMAGE URL>, 'Spezzatino di manzo con purè', CURRENT_DATE + 4, '19:30:00', 'Dinner', 750, 45, 55, 30),
  (<IMAGE URL>, 'Crackers di riso con formaggio', CURRENT_DATE + 4, '16:00:00', 'Snack', 200, 20, 10, 8),
  
  -- Giorno 6
  (<IMAGE URL>, 'Porridge con frutta e miele', CURRENT_DATE + 5, '08:00:00', 'Breakfast', 380, 55, 12, 8),
  (<IMAGE URL>, 'Riso con verdure e tofu', CURRENT_DATE + 5, '13:00:00', 'Lunch', 700, 75, 30, 18),
  (<IMAGE URL>, 'Pollo arrosto con patate', CURRENT_DATE + 5, '19:30:00', 'Dinner', 700, 50, 50, 25),
  (<IMAGE URL>, 'Crackers integrali con hummus', CURRENT_DATE + 5, '16:00:00', 'Snack', 220, 30, 10, 8);

```

You will also need to retrieve your Supabase instance URL and anon key for the next steps.

### 2. Run Chompibara

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

Create an .env file in the root of the project and include your Supabase credentials:

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

The same instructions are available on the project's README file.

## For developers

### Project structure

The project has been initialized using Vite+TS's default configuration.

Additional installed packets are:

* **Font Awesome**: For icons throughout the app.
* **Chart.js**: A simple yet effective library for creating smooth, interactive, and visually appealing custom charts.
* **ReactRouter**: A very common library to handle routing.

The folder structure is as follows:

* `src/components` contains all the custom component reused throughout the project.
* `src/assets` contains alla assets used throughout the project, such as the loading animation and the logos. The only exception `chompiabara.png`, which as been moved to `/public` in order to be used as a favicon.
* `src/context` contains utility data for the application:
  * `types` contains data structure for meals, profiles and exercises.
  * `supabaseManager.tsx` contains a utility object that wraps Supabase's official library to simplify database interactions
  * `macroColors` contains the palette chosen for macros.
* `src/pages` contains the main component for each navigable route.

### Pages

Using React Router, these are the main components for each page.

* `/pages/track/Track.tsx` -> This page lets the user upload an image and enter the details for the meal. Client-side input validation is performed. After the meal is added, the user is shown a card with their newly-added meal, and is able to edit or delete it directly.
* `/pages/exercise/Exercise.tsx` -> This page lets the user enter details for their pysical activity. Client-side input validation is performed. After the exercise is added, the user is shown a card with their newly-added exercise, and is able to edit or delete it directly.
* `/pages/history/History.tsx `-> This page is divided into two panes:
  * A dash panel, that shows graphs for the currently viewed day such as daily macronutrient and calories intake graphs.
  * A history panel, which lets the user choose a day and see the meals and exercises. Each meal/exercise card also lets the user edit or delete the card. Client-side input validation for editing is performed.
* `/pages/stats/Stats.tsx` -> This page lets the user select a custom range of time and see stats such as macronutrient and calories intake graphs throughout multiple days.
* `/pages/profile/Profiles.tsx`-> This page lets the user see and edit their profile, including setting a daily calories value that is displayed in Stats and History pages. Client-side input validation is performed.
* `/pages/homepage/Homepage.tsx ` -> This page serves as a simple welcome page for the user, briefly explaining what the application is about.

### Context

#### Types

This folder contains type definition and default/placeholder objects for Exercise, Profile and Meal data.

Data structure is the same as the corresponding database tables, and a single datatype is used as the server data structure is under the developer's total control - as opposed to using a third-party-controlled service.

```ts
export type ExerciseData = {
  id: number;
  name: string;
  date: string;
  time: string;
  duration?: string;
  calories?: number;
  type: string;
};
```

```ts
export type MealData = {
  id: number;
  photo?: string;
  title: string;
  date: string;
  time: string;
  mealtype: string;
  calories?: number;
  carbos?: number;
  fats?: number;
  protein?: number;
};
```

```ts
export type ProfileData = {
  height: number;
  age: number;
  id: number;
  name: string;
  surname: string;
  targetcarbo: number;
  targetfat: number;
  targetprotein: number;
  weight: number;
  targetcalories: number;
};
```

#### Macrocolors

`MacroColors.tsx` provides a `COLORS` object with fixed color palette to visually identify carbohydrates, fats and protein graphs.

#### SupabaseManager and its API

SupabaseManager is a singleton object that wraps Supabase's database object to simplify interaction with the database.

Should table names or storage name be edited in database, the variables

```ts
const mealDB = "MealDataDB";
const mealImgStorage = "meal-images";
const exerciseDB = "ExerciseDB";
const profileDB = "ProfileDB";
```

placed at the top of the file must be updated.

Each interaction with the database can be performed by getting the singleton with the code

```ts
  const supabaseManager = SupabaseManager.getInstance();
```

and then each function can be called from the singleton object returned. Each of the available functions has a basic handling of server-side errors, which will display an alert to the user with some information about what's going on.

All API methods are `async` and will return a `Promise`.

This is the available API:

| Name                  | Description                                                  | Parameters                                                   | Return                                                       |
| --------------------- | ------------------------------------------------------------ | ------------------------------------------------------------ | ------------------------------------------------------------ |
| `createMeal`          | Creates a new meal in the database. Image uploading is handled internally and automatically. | `meal:MealData`<br />`file:File` (optional, contains the image to be uploaded) | `Promise<number | null>`, where the number is the `id` of the created meal assigned by Supabase. |
| `getAllMeals`         | Returns an array with every meal in the database.            | None                                                         | `Promise <MealData[] | []>`                                  |
| `getAllDailyMeals`    | Returns an array with every meal recorded for a certain day. | `date:Date`                                                  | `Promise <MealData[] | []>`                                  |
| `getMealsInDateRange` | Returns an array with every meal recorded in the time period passed as parameter. | `dateStart:Date`<br/>`dateEnd:Date`                          | `Promise <MealData[] |[]>`                                   |
| `updateMeal`          | Updates the meal in the database.                            | `meal:MealData`                                              | `Promise<boolean>`, where `false` indicates the Meal has not been edited correctly. |
| `deleteMeal`          | Deletes the meal from the database.                          | `id:number`                                                  | `Promise<boolean>`, where `false` indicates the Meal has not been deleted correctly. |
| `getProfile`          | Returns the (single, at the moment) Profile in the database. | None                                                         | `ProfileData` if successful, `defaultProfile` otherwise.     |
| `setProfile`          | Edits the (single, at the moment) Profile in the database.   | `profile:ProfileData`                                        | `Promise<boolean>`, where `false` indicates the Profile has not been edited correctly. |
|                       |                                                              |                                                              |                                                              |







