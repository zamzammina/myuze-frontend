# Myuzè Frontend - MVP

A React web app for saving and following makeup tutorials from TikTok with visual GIF steps.

## Features

✅ Save TikTok tutorials (converts to swipeable GIF steps)
✅ Organize tutorials into folders
✅ Track products used in each tutorial
✅ Manage your makeup kit (have/need products)
✅ Check tutorial compatibility (can you create this look?)
✅ Upload result photos after completing tutorials
✅ Beautiful neutral color scheme (beige/cream/brown)
✅ Mobile-responsive design

## Setup Instructions

### 1. Install Dependencies

```bash
cd myuze-frontend
npm install
```

### 2. Start Development Server

```bash
npm start
```

The app will open at `http://localhost:3000`

### 3. Test on Your Phone

While `npm start` is running:

1. Find your computer's local IP address:
   - Mac: System Preferences → Network
   - Windows: `ipconfig` in terminal
   - Look for something like `192.168.1.100`

2. On your phone (connected to same WiFi):
   - Open browser
   - Go to `http://YOUR_IP:3000`
   - Example: `http://192.168.1.100:3000`

## How to Use

### Adding a Tutorial

1. Click the `+` button on home screen
2. Paste a TikTok URL
3. Name your tutorial
4. Choose number of steps (3-8)
5. Optionally select a folder
6. Click "Add Tutorial"
7. Wait 30-60 seconds for processing

### Viewing a Tutorial

1. Click any tutorial card
2. See product list and compatibility
3. Click "Start Tutorial"
4. Swipe through GIF steps
5. After last step: take result photo

### Managing Your Kit

1. Go to "My Kit" tab
2. See products you have/need
3. Tap checkmark to toggle have/need
4. Products automatically sync with tutorials

## Folder Structure

```
myuze-frontend/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── Layout.js           # Bottom navigation
│   │   └── AddTutorialModal.js # Add tutorial form
│   ├── screens/
│   │   ├── Home.js             # Tutorial library
│   │   ├── TutorialDetail.js   # Tutorial info & products
│   │   ├── TutorialViewer.js   # Swipeable GIF viewer
│   │   ├── MyKit.js            # Product inventory
│   │   └── Profile.js          # Stats & settings
│   ├── services/
│   │   └── api.js              # Backend API calls
│   ├── styles/
│   │   └── *.css               # Component styles
│   ├── App.js                  # Main app & routing
│   └── index.js                # Entry point
├── package.json
└── README.md
```

## Backend Connection

The app connects to your live backend:
```
https://myuze-mvp.onrender.com/api
```

All API calls are in `src/services/api.js`

## Color Scheme

- **Cream**: `#F5F1E8` (background)
- **Beige**: `#E8DED2` (cards, borders)
- **Light Brown**: `#C9B8A8` (accents)
- **Medium Brown**: `#A89080` (highlights)
- **Dark Brown**: `#6B5B4F` (buttons, text)

## Sharing with Your Cofounder

### Option 1: Send Them the Files
1. Zip the `myuze-frontend` folder
2. Send via email/drive
3. They run `npm install` then `npm start`

### Option 2: Deploy to Netlify/Vercel (Free)
1. Push code to GitHub
2. Connect to Netlify or Vercel
3. Deploy (takes 2 minutes)
4. Get shareable URL anyone can access

## Testing Tips

1. **Use real TikTok URLs** - the backend processes them
2. **Be patient** - video processing takes 30-60 seconds
3. **Test on mobile** - it's designed for phone screens
4. **Take result photos** - tests camera integration
5. **Add products** - tests kit compatibility feature

## Known Limitations

- Instagram support not working yet (focus on TikTok)
- No user authentication (everyone shares same account)
- Camera only works on HTTPS or localhost
- No folder management UI yet (can create when adding tutorial)

## Next Steps

After testing:
1. Get user feedback
2. Fix any bugs you find
3. Add authentication
4. Build native apps (iOS/Android)
5. Add Instagram support
6. Improve product database

## Support

Questions? Issues? Let me know!

---

**Built with ❤️ for Myuzè**
