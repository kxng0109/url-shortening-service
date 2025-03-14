# URL Shortening Service

The URL Shortening Service is a RESTful API that enables users to convert long URLs into concise, unique short codes. It supports creating, retrieving, updating, and deleting short URLs, as well as retrieving access statistics for each URL. The service leverages modern security practices, robust input validation, and a modular design using Express, MongoDB, and Mongoose. A URL Shortener API that helps shorten long URLs. Project idea gotten from [here](https://roadmap.sh/projects/url-shortening-service).

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Technologies & Dependencies](#technologies--dependencies)
- [Installation & Setup](#installation--setup)
- [Configuration](#configuration)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [URL & Short Code Specifications](#url--short-code-specifications)
- [Project Structure](#project-structure)
- [Security Considerations](#security-considerations)
- [Testing](#testing)
- [Contributing](#contributing)
- [License](#license)

---

## Overview

The URL Shortening Service is designed to be a high-performance, secure, and scalable solution for URL redirection. Users can submit long URLs, and the API will return a short, unique identifier that maps to the original URL. When the short URL is accessed, the service increments an access counter and redirects the user to the long URL. The system also provides endpoints for managing and tracking these short URLs.

---

## Features

- **URL Shortening:**  
  Convert long URLs into unique, 6-character alphanumeric short codes using a secure Nanoid generator.

- **Redirection & Statistics:**  
  Retrieve the original URL via the short code and automatically increment an access counter to track usage.

- **CRUD Operations:**  
  Create, read, update, and delete short URL records through a RESTful API.

- **Robust Input Validation:**  
  Validate incoming URL and short code formats using a combination of the `validator` library and custom regular expressions.

- **Modular Middleware Architecture:**  
  Separate middleware functions handle URL validation, short code validation, error handling, and security enhancements. This modular design ensures maintainability and testability.

- **Security Enhancements:**  
  Integrate security best practices with Helmet for HTTP headers, CORS to restrict cross-origin requests, hpp for HTTP parameter pollution prevention, and express-mongo-sanitize to guard against NoSQL injection attacks.

- **Centralized Error Handling:**  
  Standardized error responses provide consistent feedback with HTTP status codes, descriptive messages, timestamps, and request details.

---

## Technologies & Dependencies

- **Runtime & Framework:**  
  Node.js, Express

- **Database:**  
  MongoDB, with Mongoose as the ODM (Object Data Modeling) library

- **Validation:**  
  [validator](https://www.npmjs.com/package/validator)

- **Short Code Generation:**  
  [nanoid](https://www.npmjs.com/package/nanoid) for generating secure, unique 6-character codes

- **Security Packages:**  
  [helmet](https://www.npmjs.com/package/helmet), [cors](https://www.npmjs.com/package/cors), [hpp](https://www.npmjs.com/package/hpp), [express-mongo-sanitize](https://www.npmjs.com/package/express-mongo-sanitize)

- **Environment Management:**  
  [dotenv](https://www.npmjs.com/package/dotenv)

- **HTTP Status Codes:**  
  [http-status-codes](https://www.npmjs.com/package/http-status-codes)

---

## Installation & Setup

### 1. Clone the Repository

Open your terminal and run:

```bash
git clone https://github.com/kxng0109/url-shortening-service.git
cd url-shortening-service
```

### 2. Install Dependencies

Install the necessary packages via npm:

```bash
npm install
```

### 3. Environment Configuration

Create a `.env` file in the root directory of the project. Below is an example configuration:

```ini
PORT=3000
MONGO_URI=your_mongo_database_uri
```

---

## Configuration

The application uses environment variables for key settings:

- **PORT:** Defines the port on which the server runs (default is 3000).
- **MONGO_URI:** The connection string for MongoDB.

These variables are loaded at startup using the `dotenv` package.

---

## Usage

### Starting the Application

There are two entry points:

1. **app.js:**  
   Configures Express, sets up middleware (including security, validation, and error handling), and mounts API routes.

2. **server.js:**  
   Imports the configured Express app, establishes a MongoDB connection, and starts the server.

To launch the server, run:

```bash
npm start
```

This command starts the server on the defined PORT and connects to MongoDB.

---

## API Endpoints

### Create a Short URL

- **Method:** POST  
- **Endpoint:** `/api/shorten`  
- **Description:** Validates the provided long URL, generates a unique short code, and stores the mapping in the database.  
- **Request Body:**

  ```json
  {
    "url": "https://www.example.com/some/long/url"
  }
  ```

- **Success Response (201 Created):**

  ```json
  {
    "status": 201,
    "message": "Short URL created successfully.",
    "data": {
      "url": "https://www.example.com/some/long/url",
      "shortCode": "abc123"
    }
  }
  ```

---

### Retrieve the Original URL

- **Method:** GET  
- **Endpoint:** `/api/shorten/:givenShort`  
- **Description:**  
  Retrieves the original URL for the given short code and increments the access count atomically.

- **Success Response (200 OK):**

  ```json
  {
    "status": 200,
    "message": "Short URL retrieved successfully",
    "data": {
      "url": "https://www.example.com/some/long/url",
      "shortCode": "abc123",
      "createdAt": "2021-09-01T12:00:00Z",
      "updatedAt": "2021-09-01T12:00:00Z"
    }
  }
  ```

---

### Update a Short URL

- **Method:** PATCH  
- **Endpoint:** `/api/shorten/:givenShort`  
- **Description:**  
  Updates the original URL for an existing short code. The provided URL is validated before the update.
- **Request Body:**

  ```json
  {
    "url": "https://www.example.com/some/updated/url"
  }
  ```

- **Success Response (200 OK):**

  ```json
  {
    "status": 200,
    "message": "URL updated successfully",
    "data": {
      "url": "https://www.example.com/some/updated/url",
      "shortCode": "abc123",
      "createdAt": "2021-09-01T12:00:00Z",
      "updatedAt": "2021-09-01T12:30:00Z"
    }
  }
  ```

---

### Delete a Short URL

- **Method:** DELETE  
- **Endpoint:** `/api/shorten/:givenShort`  
- **Description:**  
  Deletes the specified short URL record from the database.

- **Success Response (204 No Content):**  
  No response body is returned upon successful deletion.

---

### Retrieve URL Statistics

- **Method:** GET  
- **Endpoint:** `/api/shorten/:givenShort/stats`  
- **Description:**  
  Retrieves statistics (e.g., access count) for the specified short URL.

- **Success Response (200 OK):**

  ```json
  {
    "status": 200,
    "message": "Short URL statistics retrieved successfully.",
    "data": {
      "url": "https://www.example.com/some/long/url",
      "shortCode": "abc123",
      "createdAt": "2021-09-01T12:00:00Z",
      "updatedAt": "2021-09-01T12:00:00Z",
      "accessCount": 42
    }
  }
  ```

---

## URL & Short Code Specifications

### Accepted URL Format

Our service strictly validates URLs to ensure consistency and security. Only URLs matching the following criteria will be accepted:

- **Protocols:** Only `http://` and `https://` are allowed. All URLs must include the protocol.
- **Domain:** The domain name must consist of alphanumeric characters. An optional `www.` subdomain is allowed, but if present, it must be exactly `www.` (e.g., `www.example.com`).
- **Path:** The URL path (if provided) must consist of one or more segments that are strictly alphanumeric. Trailing slashes are permitted (e.g., `https://www.awebsite.com/`).
- **Query Strings:** If query parameters are included, they must be in the format of key-value pairs with both keys and values being alphanumeric, separated by `=` and delimited by `&` (e.g., `?query=something&sort=asc`).

**Examples of Accepted URLs:**

- `https://www.google.com/search/result`
- `https://www.google.com/search?query=something`
- `https://google.com/search/result`
- `http://www.example.com/`
- `https://www.awebsite.com`

### Short Code Requirements

Each short URL is generated with a unique short code that adheres to strict rules:

- **Length:** The short code is exactly 6 characters long.
- **Character Set:** It must be alphanumeric (letters and numbers only). Special characters are not allowed.
- **Uniqueness:** The short code is generated using Nanoid, ensuring high uniqueness and security.

These constraints help ensure that the short codes are user-friendly and collision-resistant.

---

## Project Structure

```
url-shortening-service/
├── app.js                         # Main Express app configuration and middleware setup
├── server.js                      # Entry point to start the server and connect to MongoDB
├── controllers/
│   └── shorten.controllers.js     # Implements API logic for creating, retrieving, updating, and deleting short URLs
├── db/
│   └── connectDB.js               # MongoDB connection logic using Mongoose
├── middlewares/
│   ├── errorHandler.middleware.js # Global error handling middleware that standardizes error responses
│   ├── removeSlash.js             # Middleware that optionally removes leading slashes (use with caution)
│   ├── shortCodeValidator.middleware.js  # Validates short code format and existence in the database
│   └── urlValidator.middleware.js # Validates the provided long URL using custom regex and the validator library
├── model/
│   └── shorten.model.js           # Mongoose schema and model for storing URL mappings and access counts
├── routes/
│   └── shorten.routes.js          # Express routes mapping API endpoints to controller functions and middleware
└── utils/
    ├── accessCounter.js           # Utility function using MongoDB’s $inc operator to increment access counts
    └── shortCodeGenerator.js      # Utility leveraging nanoid to generate unique 6-character short codes
```

---

## Security Considerations

To safeguard the API, several security measures are implemented:

- **Helmet:** Sets secure HTTP headers to protect against common vulnerabilities.
- **CORS:** Restricts API access to trusted origins.
- **hpp:** Prevents HTTP Parameter Pollution attacks.
- **express-mongo-sanitize:** Cleans user-supplied data to prevent MongoDB operator injection.
- **Input Validation:** Ensures that only correctly formatted URLs and short codes are processed, reducing the risk of injection attacks.

---

## Testing

The project is designed to facilitate both unit and integration testing. Suggested testing practices include:

- **Unit Testing:**  
  Test individual middleware functions (e.g., URL and short code validators) using a framework such as Jest or Mocha.

- **Integration Testing:**  
  Verify that API endpoints return the expected HTTP status codes and response payloads. Use tools like Postman or automated test suites.

 - Testing functionalities are yet to be added.

---

## Contributing

Contributions to the URL Shortening Service are welcome. To contribute:

1. **Fork the Repository:**  
   Create a personal copy of the project.
2. **Create a Feature Branch:**  
   Use descriptive branch names (e.g., `feature/add-authentication`).
3. **Commit Your Changes:**  
   Follow best practices for commit messages.
4. **Submit a Pull Request:**  
   Provide a clear explanation of your changes and reference any related issues.

Please adhere to the coding standards and include tests for any new functionality.

---

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for additional details.

---