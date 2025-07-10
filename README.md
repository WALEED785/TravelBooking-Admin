Travel Booking Management System
A full-featured Travel Booking  Management web application built with React, offering functionality to manage Flights, Hotels, Bookings, Destinations, and Travel Profiles. The system supports light/dark modes and is designed for extensibility.

✈️ Features
Flight Management
Add, view, update, or delete flight records with details like airline, route, departure/arrival, and price.

Hotel Management (coming soon)
Manage hotel listings, availability, and pricing.

Bookings
Create and manage travel bookings for flights and hotels.

Destinations
Discover and manage available travel destinations.

User Profile
View and update user information.

Dark/Light Mode Toggle
Seamlessly switch between dark and light themes for better accessibility and user experience.

🚀 Getting Started
These instructions will get you a copy of the project up and running on your local machine.

Prerequisites
Node.js (v14 or higher)

npm (v6 or higher)

Installation
bash
Copy
Edit
git clone https://github.com/your-username/your-repo-name.git
cd your-repo-name
npm install
Start Development Server
bash
Copy
Edit
npm start
Open http://localhost:3200 in your browser to view the application.

🛠️ Tech Stack
Frontend: React (with Create React App)

UI: Chakra UI / TailwindCSS / Custom CSS

Routing: React Router DOM

State Management: React Context / Redux (if used)

Backend API: Swagger UI indicates ASP.NET Core or similar API stack

📁 Project Structure
bash
Copy
Edit
src/
├── components/      # Reusable components (e.g., FlightTable, Sidebar)
├── pages/           # Pages like Flights, Hotels, Dashboard, etc.
├── services/        # API calls and utility functions
├── context/         # Global state or theme context
├── assets/          # Static assets like images/icons
└── App.js           # Main entry point
📷 Screenshots

🧪 Testing
bash
Copy
Edit
npm test
Runs unit tests in watch mode.

📦 Build
bash
Copy
Edit
npm run build
Builds the app for production to the build/ folder.

📄 License
This project is licensed under the MIT License - see the LICENSE file for details.

