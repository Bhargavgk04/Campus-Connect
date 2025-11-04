# Frontend Deployment Steps for Netlify

## Quick Start

Your backend is already deployed at: **https://campus-connect-2h5f.onrender.com**

## Step 1: Environment Variables

Create a `.env` file in the `Frontend` directory (for local development):

```env
VITE_API_URL=http://localhost:8080
VITE_SOCKET_URL=http://localhost:8080
```

For production, these will be set in Netlify.

## Step 2: Deploy to Netlify

### Via Netlify Dashboard:

1. **Go to** [Netlify Dashboard](https://app.netlify.com)
2. **Click** "Add new site" → "Import an existing project"
3. **Connect** to GitHub and select your repository
4. **Configure:**
   - **Base directory**: `Frontend`
   - **Build command**: `npm run build`
   - **Publish directory**: `Frontend/dist`
5. **Add Environment Variables** (click "Show advanced"):
   - `VITE_API_URL` = `https://campus-connect-2h5f.onrender.com`
   - `VITE_SOCKET_URL` = `https://campus-connect-2h5f.onrender.com`
6. **Click** "Deploy site"

## Step 3: Update Backend CORS

After you get your Netlify URL (e.g., `https://your-site.netlify.app`):

1. Go to **Render Dashboard** → Your backend service
2. Go to **Environment** tab
3. Update:
   - `FRONTEND_URL` = `https://your-site.netlify.app`
   - `CORS_ORIGINS` = `https://your-site.netlify.app` (optional)
4. **Save** - Render will redeploy automatically

## Step 4: Verify

Test your deployed site:
- ✅ Login/Register
- ✅ View colleges
- ✅ Post questions
- ✅ Real-time updates

## Troubleshooting

**CORS Errors?**
- Check `FRONTEND_URL` in Render matches Netlify URL exactly
- Make sure URLs use `https://` (not `http://`)

**API Not Working?**
- Verify `VITE_API_URL` is set in Netlify
- Check browser console for actual API URL
- Verify backend is running on Render

**Build Fails?**
- Make sure base directory is `Frontend`
- Check that all dependencies are in `package.json`

## Files Created

- ✅ `Frontend/src/config/api.js` - API configuration
- ✅ `Frontend/netlify.toml` - Netlify configuration
- ✅ `Frontend/ENV_TEMPLATE.md` - Environment variables guide
- ✅ `Frontend/NETLIFY_DEPLOYMENT.md` - Detailed deployment guide

## Next Steps

1. Update remaining files (see `REMAINING_UPDATES.md`)
2. Test locally with production API URL
3. Deploy to Netlify
4. Update backend CORS settings

