# Tadabbr Local Development Setup

## Prerequisites

### 1. Install Go (for Backend)
Download and install Go from: https://golang.org/dl/

### 2. Install Redis (for Caching)
Download and install Redis from: https://redis.io/download

### 3. Environment Setup

Create a `.env` file in the `Tadabbr-Backend` directory with the following content:

```env
# Redis Configuration
REDISADDR=localhost:6379
REDISPASSWORD=
DB=0

# Gin Mode
GIN_MODE=debug
```

## Running the Application

### 1. Start Redis
```bash
# Windows (if installed via WSL or similar)
redis-server

# Or start Redis service if installed as Windows service
```

### 2. Setup Database
```bash
cd Tadabbr-Backend
go run scripts/migrate_quotes.go
```

### 3. Start Backend
```bash
cd Tadabbr-Backend
go run main.go
```

The backend will run on `http://localhost:8080`

### 4. Start Frontend
```bash
cd Tadabbr-Frontend
# Option 1: Using PowerShell (Windows)
.\serve.ps1

# Option 2: Using Python
python -m http.server 8000

# Option 3: Using Node.js
npx http-server -p 8000
```

The frontend will run on `http://localhost:8000`

## Accessing the Application

- **Main Site**: http://localhost:8000/home.html
- **Dashboard**: http://localhost:8000/dashboard.html
- **Backend API**: http://localhost:8080

## API Endpoints

### Quotes Management
- `GET /quotes` - List all quotes
- `POST /quotes` - Create new quote
- `GET /quotes/:id` - Get specific quote
- `PUT /quotes/:id` - Update quote
- `DELETE /quotes/:id` - Delete quote

### Existing Endpoints
- `POST /sugg` - Get suggestions
- `POST /search` - Search poems
- `POST /report/add` - Add report
- `GET /report/all` - Get all reports

## Troubleshooting

### If Go is not found:
1. Install Go from https://golang.org/dl/
2. Add Go to your PATH environment variable
3. Restart your terminal

### If Redis connection fails:
1. Make sure Redis is running
2. Check if the Redis port (6379) is available
3. Verify Redis configuration in .env file

### If frontend can't connect to backend:
1. Make sure backend is running on port 8080
2. Check CORS settings in backend
3. Verify API_BASE_URL in dashboard.js (should be http://localhost:8080)

## Development Notes

- The frontend is static HTML/JS files
- The backend uses SQLite for database
- Redis is used for caching
- All quotes functionality is implemented and ready to use
- The dashboard includes full CRUD operations for quotes 