# Environment Variables Template

Copy this to `.env` file in the Frontend directory for local development.

```env
# Backend API URL
# For local development, use: http://localhost:8080
# For production, use your Render backend URL: https://campus-connect-2h5f.onrender.com
VITE_API_URL=http://localhost:8080

# Socket.IO URL (usually same as API URL)
VITE_SOCKET_URL=http://localhost:8080
```

## For Production (Netlify)

Set these environment variables in Netlify Dashboard:

1. **VITE_API_URL** = `https://campus-connect-2h5f.onrender.com`
2. **VITE_SOCKET_URL** = `https://campus-connect-2h5f.onrender.com`

## How to Set in Netlify

1. Go to your site in Netlify Dashboard
2. Click "Site settings" → "Environment variables"
3. Click "Add a variable"
4. Add each variable:
   - Key: `VITE_API_URL`
   - Value: `https://campus-connect-2h5f.onrender.com`
5. Repeat for `VITE_SOCKET_URL`
6. Click "Save"
7. Redeploy your site

