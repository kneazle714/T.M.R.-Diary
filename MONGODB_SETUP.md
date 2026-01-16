# MongoDB Atlas Setup Guide

This guide will help you set up a new MongoDB Atlas cluster for your T.M. Riddle's Diary app.

## Step 1: Create MongoDB Atlas Account

1. Go to https://www.mongodb.com/cloud/atlas
2. Click "Try Free" or "Sign Up"
3. Sign up with your email or use Google/GitHub

## Step 2: Create a New Cluster

1. After logging in, you'll see the Atlas dashboard
2. Click "Build a Database" (or "Create" → "Database")
3. Choose the **FREE (M0) tier** (512MB storage)
4. Select a cloud provider:
   - **AWS** (recommended)
   - **Google Cloud**
   - **Azure**
5. Choose a region closest to you:
   - For US: `N. Virginia (us-east-1)` or `Oregon (us-west-2)`
   - For Europe: `Ireland (eu-west-1)`
   - For Asia: `Singapore (ap-southeast-1)`
6. Give your cluster a name (e.g., "Cluster0" or "tm-riddle-diary")
7. Click "Create Cluster"

⏱️ **Note**: Cluster creation takes 3-5 minutes

## Step 3: Create Database User

1. While the cluster is being created, you'll see a security setup screen
2. If you don't see it, go to **Database Access** in the left sidebar
3. Click "Add New Database User"
4. Choose "Password" authentication method
5. Enter:
   - **Username**: (e.g., `tmrdiaryuser` or your choice)
   - **Password**: Create a strong password (save this!)
6. Under "Database User Privileges", select "Atlas Admin" or "Read and write to any database"
7. Click "Add User"

⚠️ **Important**: Save your username and password! You'll need them for the connection string.

## Step 4: Whitelist IP Addresses

1. Go to **Network Access** in the left sidebar
2. Click "Add IP Address"
3. For development and deployment, you have two options:

   **Option A: Allow from anywhere** (easier, good for testing)
   - Click "Allow Access from Anywhere"
   - This adds `0.0.0.0/0` to the whitelist
   - Click "Confirm"

   **Option B: Add specific IPs** (more secure)
   - Click "Add Current IP Address" to add your current IP
   - For Render deployment, you may need to add Render's IP ranges
   - For local development, add your current IP

4. Click "Add IP Address" or "Confirm"

## Step 5: Get Connection String

1. Go back to **Clusters** (or **Overview**) in the left sidebar
2. Click "Connect" button on your cluster
3. Choose "Connect your application"
4. Select:
   - **Driver**: Node.js
   - **Version**: 5.5 or later (or 4.1)
5. Copy the connection string (it will look like):
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
6. Replace the placeholders:
   - Replace `<username>` with your database username
   - Replace `<password>` with your database password
   - Add database name at the end (before `?`): `/<dbname>?` becomes `/memories?`

   **Final connection string should look like:**
   ```
   mongodb+srv://tmrdiaryuser:yourpassword@cluster0.xxxxx.mongodb.net/memories?retryWrites=true&w=majority
   ```

## Step 6: Configure Your App

### For Local Development:

1. Create a `.env` file in the root of your project (if it doesn't exist)
2. Add your connection string:
   ```
   MONGO_URI=mongodb+srv://tmrdiaryuser:yourpassword@cluster0.xxxxx.mongodb.net/memories?retryWrites=true&w=majority
   NODE_ENV=development
   PORT=3000
   ```
3. **Important**: Make sure `.env` is in your `.gitignore` (it should be already)

### For Deployment (Render/Heroku/Railway):

1. Go to your deployment platform's dashboard
2. Navigate to your service → Environment Variables
3. Add a new variable:
   - **Key**: `MONGO_URI`
   - **Value**: Your connection string (the one you created in Step 5)
4. Save the environment variable

## Step 7: Test Connection

### Local Testing:

1. Make sure your `.env` file is set up
2. Install dotenv if needed (usually not needed for most setups):
   ```bash
   npm install dotenv
   ```
   Then add `require('dotenv').config()` at the top of `server/memoryModel.js` if needed.

3. Start your server:
   ```bash
   npm run dev
   ```
4. Look for the message: `Connected to Mongo DB.`
5. If you see an error, check:
   - Connection string is correct
   - Password is correct (no special characters need URL encoding)
   - IP address is whitelisted
   - Cluster is running

### Troubleshooting Connection Issues

**Error: Authentication failed**
- Double-check username and password in connection string
- Make sure you URL-encode special characters in password (e.g., `@` becomes `%40`)

**Error: IP not whitelisted**
- Go to Network Access and add `0.0.0.0/0` temporarily
- Or add your current IP address

**Error: Cannot connect**
- Make sure your cluster is running (check dashboard)
- Verify the connection string format is correct
- Check that database user has proper permissions

**Special Characters in Password:**
If your password has special characters, you need to URL-encode them:
- `@` → `%40`
- `#` → `%23`
- `$` → `%24`
- `%` → `%25`
- `/` → `%2F`
- `:` → `%3A`
- `?` → `%3F`
- `&` → `%26`
- `=` → `%3D`

Or simply create a password without special characters to avoid issues.

## Your Database Structure

Your app will automatically create a database called `memories` with a collection for your diary entries. The schema is:
- **Collection**: `memories`
- **Fields**:
  - `date`: String (unique, required) - e.g., "7.1", "12.25"
  - `content`: String (required) - the diary entry content

## Free Tier Limitations

MongoDB Atlas Free (M0) tier includes:
- 512MB storage (enough for thousands of diary entries)
- Shared RAM and vCPU
- No credit card required (for first 30 days, then optional)
- Perfect for development and small projects

If you need more, you can upgrade later.

## Security Best Practices

1. ✅ Use environment variables (never commit connection strings)
2. ✅ Use strong database passwords
3. ✅ Restrict IP access when possible (but allow deployment platform IPs)
4. ✅ Don't share your connection string publicly
5. ✅ Rotate passwords periodically
