# CardioPredict Frontend - AI Health Assessment UI

React-based frontend for cardiovascular disease risk assessment.

## 🔧 Tech Stack
- React 18
- CSS3 with Custom Properties
- Axios for API calls

## 📁 Project Structure
```
frontend/
├── public/
├── src/
│   ├── components/     # React components
│   ├── context/        # Theme context
│   ├── utils/          # Utilities (PDF, conversions)
│   ├── App.js
│   └── index.js
├── package.json
└── README.md
```

## 🚀 Local Development
```bash
# Install dependencies
npm install

# Start development server
npm start
```

The app will be available at `http://localhost:3000`

## 🏗️ Build for Production
```bash
npm run build
```

## 🌐 Deployment on Render

1. Create a new **Static Site** on Render
2. Connect your GitHub repository
3. Settings:
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `build`
4. Environment Variables:
   - `REACT_APP_API_URL`: Your backend URL (e.g., `https://your-backend.onrender.com`)

## 🔗 Backend API

This frontend requires the CardioPredict Backend API to be running.
Set the `REACT_APP_API_URL` environment variable to point to your backend.

## 📄 License
MIT License