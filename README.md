# Employee Management System (EMS) - Laravel Backend

This is the Laravel backend application for the Employee Management System, built with Inertia.js (React), Tailwind CSS, Wayfinder route generation, and Sanctum API authentication.

---

## Prerequisites

Before starting, ensure you have the following installed:
*   **PHP**: Version 8.4 or higher
*   **Composer**: PHP package manager
*   **Node.js & npm**: Node version 20+
*   **SQLite**: Required for local database storage and testing

---

## Installation & Setup

Follow these steps to set up the project locally:

### 1. Clone the Project
Navigate to your project directory.

### 2. Configure Environment Variables
Copy the example environment configuration file to create your local `.env`:
```bash
cp .env.example .env
```

### 3. Install PHP Dependencies
```bash
composer install
```

### 4. Install Node.js Dependencies
```bash
npm install
```

### 5. Generate Application Key
```bash
php artisan key:generate
```

### 6. Set Up the Database

Run database migrations and seed default data (creates default admin user and seeded departments/employees):
```bash
php artisan migrate --seed
```

### 7. Generate Route Helpers
Build assets once to trigger Laravel Wayfinder to generate TypeScript helper actions and routes:
```bash
npm run build
```
*(Alternatively, running the Vite development server will automatically generate and maintain these files)*

---

## Running the Application

To run the application locally, you will need two separate terminal processes:

### A. Start the Laravel Server
```bash
php artisan serve
```
*Note: If you need to access this backend from an external device or Android emulator, bind it to all interfaces:*
```bash
php artisan serve --host 0.0.0.0 --port 8000
```

### B. Start the Vite Frontend Server
```bash
npm run dev
```

The application will be accessible at: `http://localhost:8000`

---

## Testing & Quality Assurance

### Run PHP Feature and Unit Tests
This project uses **Pest** for automated testing. To execute the test suite:
```bash
php artisan test
```

### Run TypeScript Compilation Checks
To ensure there are no front-end type check errors:
```bash
npm run types:check
```

### Code Formatting
This project uses **Laravel Pint** to enforce formatting standards. Run the formatter on changed files before committing:
```bash
vendor/bin/pint --dirty
```
