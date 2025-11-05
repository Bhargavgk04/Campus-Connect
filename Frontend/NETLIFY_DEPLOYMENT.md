# Frontend Deployment Guide for Netlify

## Prerequisites

1. **Backend is deployed** on Render: `https://campus-connect-2h5f.onrender.com`
2. **GitHub repository** with your code
3. **Netlify account** (sign up at https://netlify.com)

## Step 1: Push Code to GitHub

1. Make sure all changes are committed:
   ```bash
   git add .
   git commit -m "Prepare frontend for Netlify deployment"
   git push origin main
   ```

## Step 2: Deploy to Netlify

### Option A: Via Netlify Dashboard (Recommended)

1. Go to [Netlify Dashboard](https://app.netlify.com)
2. Click **"Add new site"** → **"Import an existing project"**
3. Connect to **GitHub** and authorize Netlify
4. Select your repository: `Campus-Connect`
5. Configure build settings:
   - **Base directory**: `Frontend`
   - **Build command**: `npm run build`
   - **Publish directory**: `Frontend/dist`
6. Click **"Show advanced"** and add environment variables:
   - Click **"New variable"**
   - Add: `VITE_API_URL` = `https://campus-connect-2h5f.onrender.com`
   - Add: `VITE_SOCKET_URL` = `https://campus-connect-2h5f.onrender.com`
7. Click **"Deploy site"**
8. Wait for deployment to complete (usually 2-3 minutes)

### Option B: Via Netlify CLI

1. Install Netlify CLI:
   ```bash
   npm install -g netlify-cli
   ```

2. Login to Netlify:
   ```bash
   netlify login
   ```

3. Navigate to Frontend directory:
   ```bash
   cd Frontend
   ```

4. Deploy:
   ```bash
   netlify deploy --prod
   ```

5. Set environment variables:
   ```bash
   netlify env:set VITE_API_URL https://campus-connect-2h5f.onrender.com
   netlify env:set VITE_SOCKET_URL https://campus-connect-2h5f.onrender.com
   ```

6. Redeploy:
   ```bash
   netlify deploy --prod
   ```

## Step 3: Configure Environment Variables

After deployment, set environment variables in Netlify:

1. Go to your site in Netlify Dashboard
2. Click **"Site settings"** → **"Environment variables"**
3. Click **"Add a variable"**
4. Add these variables:

   **Variable 1:**
   - Key: `VITE_API_URL`
   - Value: `https://campus-connect-2h5f.onrender.com`
   - Scopes: All scopes (or Production, Deploy previews, Branch deploys)

   **Variable 2:**
   - Key: `VITE_SOCKET_URL`
   - Value: `https://campus-connect-2h5f.onrender.com`
   - Scopes: All scopes

5. Click **"Save"**
6. Go to **"Deploys"** tab
7. Click **"Trigger deploy"** → **"Deploy site"** (to rebuild with new env vars)

## Step 4: Update Backend CORS

After you get your Netlify URL (e.g., `https://your-site.netlify.app`):

1. Go to Render Dashboard
2. Open your backend service
3. Go to **"Environment"** tab
4. Update these variables:
   - `FRONTEND_URL` = `https://campusconnect-io.netlify.app`
   - `CORS_ORIGINS` = `https://campusconnect-io.netlify.app` (optional, but recommended)
5. Click **"Save Changes"**
6. Render will automatically redeploy

## Step 5: Verify Deployment

1. Visit your Netlify site URL
2. Test these features:
   - ✅ User registration
   - ✅ User login
   - ✅ View colleges
   - ✅ Enroll in colleges
   - ✅ Post questions
   - ✅ Post answers
   - ✅ Real-time updates (Socket.IO)

## Troubleshooting

### Build Fails

**Error: Module not found**
- Make sure you're building from the `Frontend` directory
- Check that all dependencies are in `package.json`
- Run `npm install` locally to verify

**Error: Environment variables not found**
- Make sure variables start with `VITE_` prefix
- Redeploy after adding environment variables

### CORS Errors

**Error: CORS policy blocked**
- Verify `FRONTEND_URL` in Render matches your Netlify URL exactly
- Check that `CORS_ORIGINS` includes your Netlify URL
- Make sure URLs use `https://` (not `http://`)

### API Calls Fail

**Error: Network error / 404**
- Verify `VITE_API_URL` is set correctly in Netlify
- Check that backend is running on Render
- Check browser console for actual API URL being used

### Socket.IO Not Working

**Error: Socket connection failed**
- Verify `VITE_SOCKET_URL` is set correctly
- Check that backend Socket.IO is configured correctly
- Verify CORS settings allow Socket.IO connections

## Important Notes

1. **Environment Variables**: 
   - Variables must start with `VITE_` to be accessible in Vite
   - Changes require a new deployment

2. **Build Settings**:
   - Base directory: `Frontend` (important!)
   - Build command: `npm run build`
   - Publish directory: `Frontend/dist`

3. **Auto-Deploy**:
   - Netlify automatically deploys on push to main branch
   - You can disable this in Site settings → Build & deploy

4. **Custom Domain**:
   - After deployment, you can add a custom domain
   - Go to Site settings → Domain management

## Next Steps

After successful deployment:

1. ✅ Test all functionality
2. ✅ Update backend `FRONTEND_URL` with your Netlify URL
3. ✅ Set up custom domain (optional)
4. ✅ Configure analytics (optional)
5. ✅ Set up form handling (if needed)

## Support

- **Netlify Docs**: https://docs.netlify.com
- **Netlify Status**: https://www.netlifystatus.com
- **Check Build Logs**: Go to Deploys tab → Click on a deploy → View logs

---

**Your frontend should now be live on Netlify!** 🎉

