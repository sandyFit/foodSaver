# FoodSaver

**FoodSaver** is your ultimate tool for managing your household food inventory, making smarter meal choices, and reducing waste. Our platform empowers you to take control of your pantry while making environmentally friendly and cost-effective decisions.

## Features

### **Track What You Have**
- Easily manage your food inventory.
- Stay on top of expiration dates with automatic tracking.

### **Optimize Ingredients**
- Use what’s about to expire first.
- Get AI-generated recipe suggestions tailored to your pantry.

### **Reduce Waste, Save Money**
- Stop throwing away food and money.
- Turn leftovers into delicious meals with creative recipe ideas.

## Project Overview

The FoodSaver project consists of the following components:

### **Frontend**
1. **Dashboard**:
   - Role-based access control for Admins and Users.
   - Manage users, food inventory, and recipes in one place.

2. **Landing Page**:
   - Visually appealing and user-friendly design.
   - Highlights FoodSaver's features and encourages user engagement.

### **Backend**
- REST API for managing food items, users, and recipe suggestions.
- Includes routes for CRUD operations and AI-based recipe suggestions.

## Tech Stack

### **Frontend**
- React.js
- HTML, CSS, Bootstrap
- Redux for state management

### **Backend**
- Node.js with Express
- Swagger for API documentation
- MongoDB for database management

### **AI Integration**
- Recipe suggestions powered by AI algorithms

## Getting Started

### Prerequisites
- Node.js and npm installed
- MongoDB instance running locally or in the cloud

###  API Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/sandyFit/foodSaver.git
   ```

2. Navigate to the server directory:
   ```bash
   cd foodsaver/server
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Set up environment variables:

    - Create a .env file in the root directory.
    - Add the following variables:
   ```bash
   MONGO_URI=your_mongodb_connection_string
   PORT=your_port
   NODE_ENV=development
   JWT_SECRET=your_secret_key
   JWT_EXPIRE_TIME=1d
   COOKIE_EXPIRES_TIME=1
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

6. Access the application at `http://localhost:${PORT}`.

## API Documentation

Swagger documentation is available for all endpoints. To access it:
1. Start the backend server.
2. Navigate to `http://localhost:${PORT}/api-docs` in your browser.


## Frontend Installation
1. Navigate to the client directory:
   ```bash
   cd foodsaver/client
   ```

2. Install dependencies:
   ```bash
   npm install

3. Start the development client:
   ```bash
   npm run dev
   ```

## Contact
For questions, feedback, or support, please contact us at [support@foodsaver.com](mailto:trishramos29@gmail.com).

