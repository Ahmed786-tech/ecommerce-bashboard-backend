# e-dashboard

A backend API built with **Express**, **TypeScript**, and **MongoDB** for managing users, products, and orders in an e-commerce dashboard.

---

## Table of Contents

- [Features](#features)  
- [Prerequisites](#prerequisites)  
- [Installation](#installation)  
- [Environment Setup](#environment-setup)  
- [Available Scripts](#available-scripts)  
- [Project Structure](#project-structure)  
- [Usage](#usage)  
- [Notes](#notes)  
- [Troubleshooting](#troubleshooting)  
- [License](#license)

---

## Features

- User registration with password hashing (bcryptjs)  
- Product model with stock status virtuals  
- Order model linking users and products  
- TypeScript interfaces for schema validation  
- Ready for adding REST API endpoints  
- Seed script for populating initial data  

---

## Prerequisites

- [Node.js](https://nodejs.org/) (v18 or above recommended)  
- MongoDB (Atlas cloud or local instance)  
- Package manager: `npm` or `yarn`  
- [VSCode](https://code.visualstudio.com/) (recommended editor)  

---

## Installation

1. **Clone the repo**

   ```bash
   git clone <your-repo-url>
   cd <your-repo-name>

2. scripts**

   ```bash
   npm install
   ```

   | Command         | Description                            |
| --------------- | -------------------------------------- |
| `npm run build` | Compile TypeScript to JavaScript       |
| `npm run start` | Run compiled code from `dist/index.js` |
| `npm run dev`   | Run in development mode with nodemon   |
| `npm run seed`  | Seed database with initial data        |


2. **Set up environment variables**

   Create a `.env` file in the root directory and add your MongoDB connection string:

   ```plaintext
   MONGO_URI=mongodb://<username>:<password>@localhost:27017/<dbname>
   ```

   port: 3000
