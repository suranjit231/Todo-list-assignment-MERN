# Todo App - MERN Stack

This repository contains a Todo List application built using the MERN stack. The application allows users to create, update, delete, and manage their tasks efficiently. The app is fully responsive, working seamlessly across all devices.

## Table of Contents

- [Features](#features)
- [Technologies Used](#technologies-used)
- [Getting Started](#getting-started)
- [Backend Configuration](#backend-configuration)
- [Frontend Configuration](#frontend-configuration)
- [Environment Variables](#environment-variables)
- [Usage](#usage)
- [Screenshots](#screenshots)
- [License](#license)

## Features

- **Create Task**: Add new tasks to your todo list.
- **Update Task**: Edit existing tasks to keep your list up to date.
- **Delete Task**: Remove tasks that are no longer needed.
- **Get All Pending Tasks**: View all tasks that are yet to be completed.
- **Get All Completed Tasks**: View all tasks that have been marked as completed.
- **Mark Task as Complete**: Easily mark tasks as done.

## Technologies Used

- **Frontend**: React, Redux
- **Backend**: Node.js, Express.js, MongoDB
- **Database**: MongoDB Atlas
- **Authentication**: JWT (JSON Web Token)

## Getting Started

To get a local copy up and running, follow these simple steps:

### Prerequisites

- Node.js
- MongoDB Atlas (for database)

### Clone the Repository

```bash
git clone https://github.com/suranjit231/Todo-list-assignment-MERN.git
cd Todo-list-assignment-MERN
```

## Setup and Configuration:
### Backend Configuration
1. Navigate to the backend directory:
   - cd backend -
2. Install the necessary packages:
   ```
   npm install
   ```
3. Set up the environment variables:
   * Create a .env file in the backend directory with the following content:
     ```
     DB_URL=mongodb+srv:
     JWT_SECRET=
     PORT=
     ```
4. Start the backend server:
   - node server.js

### Frontend Configuration:
1. Navigate to the client directory:
   ```
   cd client
   ```
2. Install the necessary packages:
   ```
   npm install
   ```
3. Set up the environment variables:
   - Create a .env file in the client directory with the following content:
     ```
     REACT_APP_SERVER_URL: your backend url
     ```
4. Start the frontend application:
   ```
   npm start
   ```
   

