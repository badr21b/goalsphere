# Gemini API Troubleshooting Guide

## Current Issue: API Key Validation Error

The error you're seeing (`API key not valid`) indicates that the Gemini API key needs to be properly configured.

## Quick Fix Steps

### 1. Test API Key First
1. Go to your API test page: `http://localhost:3000/apitest`
2. Click the **"Test Gemini API Key"** button (blue button)
3. This will show you if the API key is working

### 2. If API Key Test Fails

#### Option A: Get a New API Key
1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a new API key
3. Replace the key in your `.env.local` file:
   ```bash
   GEMINI_API_KEY=your_new_api_key_here
   ```

#### Option B: Use Fallback Mode
The system will automatically fall back to basic data processing without AI enhancement if the API key is invalid.

### 3. Restart Your Development Server
```bash
npm run dev
```

## What Each Button Does

### 🔑 "Test Gemini API Key" (Blue Button)
- Tests if your Gemini API key is valid
- Shows detailed error information if it fails
- Safe to run multiple times

### 🤖 "Test Gemini AI + TheSportsDB" (Purple Button)
- Fetches real data from TheSportsDB
- Processes it with Gemini AI (if API key works)
- Falls back to basic processing if API key fails
- Shows live matches, fixtures, news, and standings

### 🔴 "Test All APIs" (Red Button)
- Tests the original API configuration
- Doesn't use Gemini AI

## Expected Behavior

### With Valid API Key:
- ✅ API Key Test shows "Valid"
- ✅ Gemini AI test shows enhanced data with AI-generated content
- ✅ News articles are intelligently generated
- ✅ Data is processed and enhanced by AI

### With Invalid API Key:
- ❌ API Key Test shows "Invalid" with error details
- ⚠️ Gemini AI test still works but uses fallback processing
- ⚠️ Data is fetched from TheSportsDB but not AI-enhanced
- ⚠️ News articles are basic mock data

## Debug Information

### Check Environment Variables
```bash
# In your terminal
echo $GEMINI_API_KEY
```

### Check .env.local File
```bash
# Make sure this file exists and has your API key
cat .env.local
```

### Check Console Logs
Open browser DevTools (F12) and check the Console tab for detailed error messages.

## Common Issues

### 1. "API key not valid"
- **Cause**: Invalid or expired API key
- **Fix**: Get a new API key from Google AI Studio

### 2. "Quota exceeded"
- **Cause**: API usage limit reached
- **Fix**: Wait for quota reset or upgrade plan

### 3. "Permission denied"
- **Cause**: API key doesn't have required permissions
- **Fix**: Check API key permissions in Google Cloud Console

### 4. "Network error"
- **Cause**: Connection issues
- **Fix**: Check internet connection and try again

## Fallback Mode

Even if Gemini API fails, the system will:
- ✅ Still fetch data from TheSportsDB
- ✅ Process and normalize the data
- ✅ Show live matches, fixtures, and standings
- ⚠️ Use basic news instead of AI-generated content
- ⚠️ Skip AI enhancement features

## Getting Help

If you're still having issues:
1. Check the browser console for detailed errors
2. Try the "Test Gemini API Key" button first
3. Verify your API key is correct
4. Make sure your `.env.local` file is properly configured

The system is designed to work even without a valid Gemini API key, so you can still test the TheSportsDB integration!
