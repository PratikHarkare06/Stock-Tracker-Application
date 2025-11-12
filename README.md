# Stock Tracker Application - Production Backend

This document describes how to set up and run the complete Stock Tracker application with the production backend.

## Architecture Overview

The application now consists of:

1. **Frontend**: React/TypeScript application (already existing)
2. **Backend**: NestJS REST API with PostgreSQL database
3. **RPA Bots**: Python/Selenium scripts for data scraping

## Prerequisites

- Node.js (v14 or higher)
- Python (v3.8 or higher)
- Docker and Docker Compose
- PostgreSQL client

## Setup Instructions

### 1. Start the Database

```bash
cd backend/stock-tracker-backend
docker-compose up -d
```

### 2. Start the Backend Server

```bash
cd backend/stock-tracker-backend
npm run start
```

The backend will be available at http://localhost:3000

### 3. Run the RPA Bots (Optional)

```bash
cd backend/rpa-bots
pip install -r requirements.txt
python run_bots.py
```

### 4. Start the Frontend

In the root directory:

```bash
npm run dev
```

The frontend will be available at http://localhost:5173

## API Endpoints

### Funds
- `GET /funds` - Get all mutual funds
- `GET /funds/holdings/:stockId` - Get holdings for a specific stock
- `POST /funds/compare` - Compare two funds

### Stocks
- `GET /stocks` - Get all stocks
- `POST /stocks/update-random` - Update a random stock price

### Indices
- `GET /indices` - Get all indices

### Bots
- `GET /bots/logs` - Get bot execution logs
- `POST /bots/:id/run` - Run a specific bot

### Authentication
- `POST /auth/login` - User login

## RPA Bots

The application includes three RPA bots:

1. **NSE Bot** - Scrapes stock information from NSE
2. **AMC Bot** - Scrapes mutual fund information from AMC websites
3. **Indices Bot** - Scrapes index information

## Database Schema

See [SCHEMA.md](backend/stock-tracker-backend/SCHEMA.md) for detailed database schema.

## Development

### Backend Development

```bash
cd backend/stock-tracker-backend
npm run start:dev
```

### Frontend Development

```bash
npm run dev
```

## Testing

To test the integration between frontend and backend:

1. Ensure the database is running
2. Start the backend server
3. Start the frontend
4. Navigate through the UI to verify data is loaded from the backend
5. Run bots to verify data updates