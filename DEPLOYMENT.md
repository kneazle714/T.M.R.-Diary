# Deployment Guide

This guide will help you deploy the T.M. Riddle's Diary app to production.

## Prerequisites

- A MongoDB Atlas account (or your own MongoDB instance)
- A deployment platform account (Render, Heroku, Railway, etc.)

## Option 1: Deploy to Render (Recommended - Free Tier Available)

### Steps:

1. **Push your code to GitHub**
   ```bash
   git add .
   git commit -m "Prepare for deployment"
   git push origin main
   ```

2. **Create a Render account**
   - Go to https://render.com
   - Sign up with your GitHub account

3. **Create a new Web Service**
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Use these settings:
     - **Name**: tm-riddle-diary (or your preferred name)
     - **Environment**: Node
     - **Build Command**: `npm install && npm run build`
     - **Start Command**: `npm start`
     - **Plan**: Free (or paid if you prefer)

4. **Set Environment Variables**
   - Click on "Environment" tab
   - Add the following:
     - `NODE_ENV` = `production`
     - `MONGO_URI` = `your-mongodb-connection-string`
     - `PORT` will be automatically set by Render

5. **Deploy**
   - Click "Create Web Service"
   - Render will automatically build and deploy your app
   - Your app will be available at `https://your-app-name.onrender.com`

6. **Add Custom Domain (Optional)**
   - In your Render service dashboard, go to "Settings" → "Custom Domains"
   - Click "Add Custom Domain"
   - Enter your domain (e.g., `tmrdiary.com` or `www.tmrdiary.com`)
   - Render will provide DNS records to add:
     - **For root domain (tmrdiary.com)**: Add a CNAME record pointing to `your-app-name.onrender.com`
     - **For www subdomain**: Add a CNAME record pointing to `your-app-name.onrender.com`
   - Update your domain's DNS settings at your domain registrar (see "Custom Domain Setup" section below)

## Option 2: Deploy to Heroku

### Steps:

1. **Install Heroku CLI** (if not already installed)
   ```bash
   # macOS
   brew tap heroku/brew && brew install heroku
   ```

2. **Login to Heroku**
   ```bash
   heroku login
   ```

3. **Create a Heroku app**
   ```bash
   heroku create your-app-name
   ```

4. **Set environment variables**
   ```bash
   heroku config:set NODE_ENV=production
   heroku config:set MONGO_URI=your-mongodb-connection-string
   ```

5. **Add buildpacks**
   ```bash
   heroku buildpacks:add heroku/nodejs
   ```

6. **Update package.json** (add engines field if needed)
   ```json
   "engines": {
     "node": "18.x",
     "npm": "9.x"
   }
   ```

7. **Deploy**
   ```bash
   git push heroku main
   ```

## Option 3: Deploy to Railway

### Steps:

1. **Go to Railway**
   - Visit https://railway.app
   - Sign up with GitHub

2. **Create a new project**
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your repository

3. **Configure the service**
   - Railway will auto-detect Node.js
   - Set build command: `npm install && npm run build`
   - Set start command: `npm start`

4. **Add environment variables**
   - Go to Variables tab
   - Add `MONGO_URI` with your MongoDB connection string
   - Add `NODE_ENV=production`

5. **Deploy**
   - Railway will automatically deploy on every push to main

## MongoDB Atlas Setup

If you need to set up MongoDB Atlas:

1. **Create an account** at https://www.mongodb.com/cloud/atlas
2. **Create a new cluster** (free tier available)
3. **Create a database user**
   - Go to Database Access
   - Create a new user with username and password
4. **Whitelist IP addresses**
   - Go to Network Access
   - Add `0.0.0.0/0` to allow all IPs (or your specific IPs)
5. **Get connection string**
   - Go to Clusters → Connect
   - Choose "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your database user password
   - Replace `<dbname>` with `memories` (or update in memoryModel.js)

## Testing Production Build Locally

Before deploying, test the production build locally:

```bash
# Build the production bundle
npm run build

# Start the production server
NODE_ENV=production npm start
```

Visit `http://localhost:3000` to test.

## Troubleshooting

### Build fails
- Make sure all dependencies are in `package.json`
- Check that Node.js version is compatible (18.x recommended)

### App crashes on startup
- Check environment variables are set correctly
- Verify MongoDB connection string is correct
- Check server logs for error messages

### Static files not loading
- Ensure `npm run build` completed successfully
- Check that `dist` folder exists and contains `bundle.js` and `index.html`

### MongoDB connection issues
- Verify MongoDB Atlas IP whitelist includes your deployment platform's IPs
- Check database user credentials
- Ensure connection string format is correct

## Custom Domain Setup (tmrdiary.com)

You can use a custom domain like `tmrdiary.com` with any deployment platform. Here's how:

### Step 1: Purchase a Domain

Popular domain registrars:
- **Namecheap** (https://www.namecheap.com) - ~$10-15/year
- **Google Domains** (https://domains.google) - ~$12/year
- **Cloudflare** (https://www.cloudflare.com/products/registrar) - at-cost pricing
- **GoDaddy** (https://www.godaddy.com) - ~$12-15/year

Search for `tmrdiary.com` and purchase it if available.

### Step 2: Configure DNS Records

After purchasing, you need to point your domain to your deployment platform:

#### For Render:
1. In Render dashboard → Your Service → Settings → Custom Domains
2. Add your domain (`tmrdiary.com` and `www.tmrdiary.com`)
3. Render will show you DNS records to add:
   - **CNAME record**: `www` → `your-app-name.onrender.com`
   - **A record** or **CNAME**: `@` (root) → Render's IP or hostname
4. Go to your domain registrar's DNS settings and add these records
5. Wait 24-48 hours for DNS propagation

#### For Heroku:
1. Run: `heroku domains:add tmrdiary.com`
2. Run: `heroku domains:add www.tmrdiary.com`
3. Heroku will provide DNS targets
4. Add CNAME records at your domain registrar:
   - `www` → `your-app-name.herokudns.com`
   - `@` → Use Heroku's provided target

#### For Railway:
1. Go to your service → Settings → Domains
2. Add custom domain
3. Railway provides DNS records to configure
4. Update DNS at your registrar

### Step 3: SSL Certificate

Most platforms (Render, Heroku, Railway) automatically provision SSL certificates via Let's Encrypt, so your site will be available at `https://tmrdiary.com` automatically.

### DNS Configuration Example (Namecheap)

If using Namecheap:
1. Go to Domain List → Manage → Advanced DNS
2. Add these records:
   ```
   Type: CNAME Record
   Host: www
   Value: your-app-name.onrender.com
   TTL: Automatic
   
   Type: CNAME Record (or A Record)
   Host: @
   Value: [provided by Render/Heroku]
   TTL: Automatic
   ```

### Quick Domain Check

After setting up DNS, verify it's working:
- Use https://dnschecker.org to see if DNS has propagated globally
- Use https://www.whatsmydns.net to check DNS records

### Free Domain Options

Unfortunately, truly free custom domains are very limited and often unreliable:

#### ⚠️ Not Recommended:
- **Freenom** (.tk, .ml, .ga, .cf domains) - Used to be free but now unreliable, often suspended
- **Free subdomain services** - Usually have restrictions and look unprofessional

#### ✅ Better Alternatives:

1. **Use Platform Subdomain (Free)**
   - Render: `your-app.onrender.com` (free, works great!)
   - Heroku: `your-app.herokuapp.com` (free)
   - Railway: `your-app.railway.app` (free)
   - These are professional, reliable, and free forever

2. **Very Cheap Domains** (~$1-2/year):
   - **Namecheap** sometimes has $0.99-$1.99 first-year deals
   - **Cloudflare Registrar** - sells domains at cost (no markup)
   - **Porkbun** - often has good deals
   - Check for promotions and first-year discounts

3. **Student Discounts**:
   - **GitHub Student Pack** - includes free domain credits
   - **Namecheap Student** - discounts for students
   - If you're a student, these can get you a free or heavily discounted domain

4. **Free Subdomain from Some Services**:
   - Some platforms offer free subdomains on their own domains
   - Example: `tmrdiary.vercel.app` (if using Vercel)

#### Recommendation:
For a professional app, either:
- Use the free platform subdomain (`your-app.onrender.com`) - it's free and works perfectly
- Spend $1-2/year for a cheap domain during promotions
- Use GitHub Student Pack if you're a student

### Cost Breakdown

- **Domain**: 
  - Free: Use platform subdomain (recommended)
  - Cheap: ~$1-2/year (promotional pricing)
  - Regular: ~$10-15/year
- **Hosting**: Free (Render free tier) or paid plans
- **SSL Certificate**: Free (automatic with most platforms)
- **Total**: $0 (platform subdomain) to ~$15/year (custom domain)

## Notes

- The app uses environment variables for configuration
- MongoDB connection string should be kept secret (use environment variables)
- The production build creates optimized bundles in the `dist` folder
- The Express server serves the React app in production mode
- Custom domains work on free tiers of most platforms
