# FoodSaver

**FoodSaver** is your ultimate tool for managing your household food inventory, making smarter meal choices, and reducing waste. Our platform empowers you to take control of your pantry, making environmentally friendly and cost-effective decisions.

![FoodSaver Dashboard Screenshot](client/public/screenshot-dashboard.jpg) 

*A glimpse of the FoodSaver dashboard, where you can manage your inventory, track expiration dates, and discover recipes.*

## Key Features

* **Effortless Inventory Management:**  Easily add, edit, and categorize your food items. Keep track of quantities and storage locations.
* **Automatic Expiration Tracking:** Never let food go to waste again! FoodSaver automatically monitors expiration dates and alerts you when items are nearing their expiration.
* **AI-Powered Recipe Suggestions:** Get personalized recipe recommendations based on the ingredients you have on hand, with a focus on using items close to expiring.
* **Reduce Food Waste & Save Money:** Make informed meal choices, minimize waste, and save money on groceries.
* **Leftover Transformation:**  Turn last night's dinner into a brand new meal with creative recipe ideas for using leftovers.

## How FoodSaver Works

FoodSaver combines a user-friendly interface with powerful backend functionality and AI to help you manage your food effectively.

1. **Add your food items:** Easily input your groceries into the system, specifying name, quantity, expiration date, and storage location.
2. **Track expiration dates:** FoodSaver automatically monitors expiration dates and provides timely notifications to prevent food spoilage.
3. **Get recipe recommendations:** Our AI algorithm analyzes your inventory and suggests delicious recipes tailored to your available ingredients.
4. **Reduce waste and save money:** By using what you have and minimizing spoilage, you'll reduce food waste and save money on your grocery bills.

## Project Structure

### Frontend

* **Dashboard:**
    * Role-based access control for Admins and Users.
    * Manage users, food inventory, and recipes in one central location.
* **Landing Page:**
    * Visually appealing design with clear calls to action.
    * Highlights FoodSaver's features and benefits.

### Backend

* **REST API:**  Provides endpoints for managing food items, users, and recipe suggestions.
* **CRUD Operations:**  Supports creating, reading, updating, and deleting data.
* **AI Integration:**  Utilizes AI algorithms to generate personalized recipe recommendations.

## Tech Stack

### Frontend

* React.js
* HTML, CSS, Bootstrap
* Context API for managing global state

### Backend

* Node.js with Express
* Swagger for API documentation
* MongoDB for database management

## Getting Started

### Prerequisites

* Node.js and npm (or yarn) installed
* MongoDB instance running (local or cloud-based)

### API Installation

1. **Clone the repository:**
   ```bash
   git clone [https://github.com/sandyFit/foodSaver.git](https://github.com/sandyFit/foodSaver.git)
   ```
2. **Navigate to the server directory:**
   ```bash
   cd foodsaver/server
   ```
3. **Install dependencies:**
   ```bash
   npm install
   ```
4. **Create a `.env` file in the `server` directory:**
   ```bash
   MONGO_URI=<your_mongodb_connection_string>
   PORT=<your_desired_port> 
   NODE_ENV=development
   JWT_SECRET=<your_secret_key>
   JWT_EXPIRE_TIME=1d 
   COOKIE_EXPIRES_TIME=1 
   ```
5. **Start the development server:**
   ```bash
   npm run dev 
   ```
6. **Access the API documentation:**
   * Open your browser and go to `http://localhost:<your_desired_port>/api-docs`


## Frontend Installation

1. **Navigate to the client directory:**
   ```bash
   cd foodsaver/client
   ```
2. **Install dependencies:**
   ```bash
   npm install
   ```
3. **Start the development client:**
   ```bash
   npm run dev
   ```

## Troubleshooting

* **Problem:**  "Cannot connect to database" error.
    * **Solution:** Ensure your MongoDB instance is running and that the `MONGO_URI` in your `.env` file is correct.
* **Problem:**  Frontend cannot connect to the backend.
    * **Solution:**  Verify that both the frontend and backend servers are running and that the correct port is being used in the frontend's API calls.

## Contributing

We welcome contributions to FoodSaver! Please feel free to submit bug reports, feature requests, or pull requests.

## Contact

For questions, feedback, or support, please contact us at [support@foodsaver.com](mailto:trishramos29@gmail.com). 

