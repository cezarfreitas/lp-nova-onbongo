# ONBONGO - Deployment Guide

## 🚀 Easypanel Deployment

This application is ready for deployment on Easypanel using Docker.

### Prerequisites
- Easypanel account
- Docker support enabled

### Deployment Steps

1. **Push code to Git repository** (GitHub, GitLab, etc.)

2. **Create new service in Easypanel:**
   - Go to your Easypanel dashboard
   - Click "Create Service"
   - Choose "Docker" as the source type

3. **Configure the service:**
   ```
   Source Type: Git Repository
   Repository URL: [your-git-repo-url]
   Branch: main
   Build Method: Dockerfile
   Dockerfile Path: ./Dockerfile
   ```

4. **Environment Variables:**
   ```
   NODE_ENV=production
   PORT=3000
   PING_MESSAGE=ONBONGO API is running!
   ```

5. **Port Configuration:**
   - Internal Port: 3000
   - External Port: 80 (or your preferred port)

6. **Domain Setup:**
   - Configure your custom domain in Easypanel
   - Enable SSL/HTTPS

### Local Testing with Docker

Before deploying, test the Docker build locally:

```bash
# Build the image
docker build -t onbongo-app .

# Run the container
docker run -p 3000:3000 -e NODE_ENV=production onbongo-app

# Or use docker-compose
docker-compose up --build
```

Visit `http://localhost:3000` to test the application.

### Health Check

The application includes a health check endpoint:
- **Endpoint**: `/api/ping`
- **Expected Response**: `{"message": "ONBONGO API is running!"}`

### Production Notes

- The app serves both the React frontend and Express API
- Static files are served from the built React app
- CORS is enabled for API requests
- Non-root user for security
- Multi-stage build for optimized image size

### Troubleshooting

1. **Build fails**: Check that all dependencies are correctly specified in package.json
2. **App won't start**: Verify environment variables are set correctly
3. **Health check fails**: Ensure the `/api/ping` endpoint is accessible

### File Structure
```
/app
├── dist/
│   ├── spa/          # Built React frontend
│   └── server/       # Built Express server
├── package.json
└── node_modules/
```

## 🔧 Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NODE_ENV` | Environment mode | `production` |
| `PORT` | Server port | `3000` |
| `PING_MESSAGE` | Health check message | `ping` |

Add additional environment variables as needed for your production setup.
