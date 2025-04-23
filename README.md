<p align="center">
  <img src="https://github.com/user-attachments/assets/b02f486e-0031-4375-90a4-8f1a7bbbd150" alt="Say hi to Chompibara!"/>
</p>

# Chompibara

Chompibara is a food tracking application built with React, designed to help users monitor their nutrition by uploading photos of their meals and manually adding nutritional information. It offers a daily food diary, with visual charts to track calorie and macro consumption.

Chompibara is an educational project, created for learning purposes, as part of a university React course.

## Project Objectives

This project had the main objective of serving as a learning project to get used to React's development style.
More generally, the scope of the project for teams based on a single person are:

- Meal photo upload: Users can take or upload a photo of their meal.
- Manual editing: Users can add new meals with related nutritional values.
- Daily food log: A list of meals with nutritional details.
- Progress charts: Stats on the daily calories intake.
- Exercise tracking: Users can add exercise activities, including details such as the type of exercise, duration and calories burned.

As a personal, additional objective I decided to try and make an app that had a simple, quirky design,

## Features

- **Meal Tracking**: Users can add, update, and delete meals, including details like calories, macronutrients, and meal type. They can also add an image to visually represent their meal, and categorize them by their tipe (e.g. lunch, dinner)
  ![image](https://github.com/user-attachments/assets/e0cdd0fc-149a-4e21-96d2-f6abf96a2077)
- **Exercise Tracking**: Users can log basic exercises data, including details like calories burned, duration, and exercise type.
  ![image](https://github.com/user-attachments/assets/8a51e608-6f4f-4830-bfc2-0aca8277c84c)

- **Profile Management**: Users can update their profile information, including height, weight, age, and target macros/calories.
  ![image](https://github.com/user-attachments/assets/89952f32-cc62-4275-a800-8fc76840d1a1)
- **Daily history**: Users can view their recorder meal for each day, and have an aesthetically pleasing dashboard informing them of their macronutrient and calories intake throughout the day.
  ![image](https://github.com/user-attachments/assets/274e6d6d-4fb4-40ed-9ba8-e11fd79e6eb2)
- **Global stats**: There is also a different page to get similar information throughout a personalized time period, to visualize longer trends and improvements.
  ![image](https://github.com/user-attachments/assets/baaeb2b4-a655-4090-8e36-7a493d683dbe)
- **Mobile-friendly**: the app's layout adapts to smaller screens
- **AI-powered autofill**: Once the user loads an image, it's possible to ask AI to look at the picture and autofill the form for them.

## Installation and further details about the application

Please refer to the documentation in `documenation/Documentation.md`, which contains very detailed information and implementation specifics about the installation of the app and the database, as well as the developed components.

## Technologies Used

- **React+Typescript**: The core library for building the user interface.
- **Supabase**: For managing the database and handling authentication.
- **Font Awesome**: For icons throughout the app.
- **Recharts**: A simple yet effective library for creating smooth, interactive, and visually appealing custom charts.

## Limitations

- At the moment, the app only supports a single user and it's not possible to make different accounts and log in/out.
- Accessibility has not been a focus for this development cycle; hence, it would be strongly suggested to check how accessible the app is for future developments.
- It's not possible to export/import data user-side.
- All meal details must be entered by hand, and there is no feature to allow for making template meals or easily copy old meals.

## Future improvements

- Allow for users to create different profiles and log into them
- Add meal templates or favorites
- Add weight tracking
- Switch to Tailwind and improve the design system
- Support an offline setup, as Supabase is selfhostable and storing personal health data on a third-party server might raise privacy and security concerns.
