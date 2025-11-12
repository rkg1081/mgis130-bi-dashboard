# 📊 Competitive Intelligence Dashboard

A production-ready business intelligence dashboard that tracks competitor stock performance for major technology companies. Built for deployment on Vercel with serverless architecture.

![Dashboard Preview](https://img.shields.io/badge/Status-Production%20Ready-success)
![Vercel](https://img.shields.io/badge/Deploy-Vercel-black)
![License](https://img.shields.io/badge/License-MIT-blue)

## 🎯 Features

### Real-Time Stock Tracking
- Monitors stock prices for **Apple (AAPL)**, **Microsoft (MSFT)**, **Google (GOOGL)**, **Meta (META)**, and **Amazon (AMZN)**
- Visual highlighting of highest (green) and lowest (red) prices
- Automatic price comparisons with change indicators

### Professional Interface
- High-contrast design optimized for business presentations
- Responsive layout that works on mobile, tablet, and desktop
- WCAG AA compliant for accessibility
- Smooth fade-in animations for enhanced UX

### Data Management
- **Refresh Data** button for real-time updates
- **Export to CSV** functionality for reports and presentations
- Timestamp tracking for data collection
- Loading and error states for better UX

## 🏗️ Architecture

```
mgis130-bi-dashboard/
├── api/
│   └── stocks.js          # Serverless function for API calls
├── index.html             # Interactive frontend dashboard
├── vercel.json            # Vercel deployment configuration
├── .env.example           # Environment variable template
└── README.md              # Project documentation
```

### Technology Stack
- **Frontend**: Vanilla JavaScript, HTML5, CSS3
- **Backend**: Vercel Serverless Functions (Node.js)
- **API**: API Ninjas Stock Price API
- **Deployment**: Vercel

## 🚀 Deployment Instructions

### Prerequisites
1. A [Vercel](https://vercel.com) account
2. An API key from [API Ninjas](https://api-ninjas.com/)

### Step 1: Get Your API Key
1. Visit [API Ninjas](https://api-ninjas.com/)
2. Sign up for a free account
3. Navigate to your dashboard to get your API key

### Step 2: Deploy to Vercel

#### Option A: Deploy via Vercel Dashboard
1. Push this repository to GitHub
2. Visit [Vercel Dashboard](https://vercel.com/new)
3. Import your repository
4. Add environment variable:
   - **Key**: `API_KEY`
   - **Value**: Your API Ninjas API key
5. Click "Deploy"

#### Option B: Deploy via Vercel CLI
```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel

# Add environment variable
vercel env add API_KEY
# Paste your API Ninjas API key when prompted
```

### Step 3: Access Your Dashboard
Once deployed, Vercel will provide you with a URL (e.g., `https://your-project.vercel.app`)

## 🔧 Local Development

### Setup
```bash
# Clone the repository
git clone https://github.com/yourusername/mgis130-bi-dashboard.git
cd mgis130-bi-dashboard

# Create .env file from example
cp .env.example .env

# Add your API key to .env
echo "API_KEY=your_api_ninjas_key_here" > .env

# Install Vercel CLI for local testing
npm i -g vercel

# Run local development server
vercel dev
```

### Testing
Open your browser and navigate to `http://localhost:3000`

## 📝 API Documentation

### Endpoint: `/api/stocks`

#### Request
```
GET /api/stocks
```

#### Response
```json
{
  "timestamp": "2025-11-10T15:30:00.000Z",
  "stocks": [
    {
      "ticker": "AAPL",
      "companyName": "Apple Inc.",
      "price": 189.50
    },
    {
      "ticker": "MSFT",
      "companyName": "Microsoft Corporation",
      "price": 378.85
    }
  ],
  "metadata": {
    "total": 5,
    "successful": 5,
    "failed": 0
  }
}
```

#### Error Response
```json
{
  "error": "Service unavailable",
  "message": "Unable to fetch stock data from API",
  "details": []
}
```

## 🎨 Customization

### Adding More Companies
Edit `/api/stocks.js` and add companies to the `COMPANIES` object:

```javascript
const COMPANIES = {
  AAPL: 'Apple Inc.',
  MSFT: 'Microsoft Corporation',
  GOOGL: 'Alphabet Inc. (Google)',
  META: 'Meta Platforms Inc.',
  AMZN: 'Amazon.com Inc.',
  TSLA: 'Tesla Inc.',  // Add new company
  NVDA: 'NVIDIA Corporation'  // Add another
};
```

### Changing Colors
Edit CSS variables in `index.html`:

```css
:root {
    --primary-bg: #0a0e27;      /* Main background */
    --secondary-bg: #1a1f3a;    /* Card background */
    --success-color: #10b981;   /* Highest price color */
    --danger-color: #ef4444;    /* Lowest price color */
    --accent-blue: #3b82f6;     /* Accent color */
}
```

## 🔒 Security Features

- API key stored securely in environment variables
- CORS headers configured for security
- Input validation and error handling
- No sensitive data exposed to frontend
- Rate limiting handled by API Ninjas

## 📊 Business Use Cases

1. **Competitive Analysis**: Track competitor valuations in real-time
2. **Executive Dashboards**: Display during board meetings and presentations
3. **Market Research**: Export data for trend analysis and reporting
4. **Investment Tracking**: Monitor technology sector leaders

## 🐛 Troubleshooting

### Issue: "API key not configured"
**Solution**: Add `API_KEY` environment variable in Vercel dashboard

### Issue: "Unable to load data"
**Solution**:
1. Verify your API key is valid
2. Check API Ninjas account status
3. Review Vercel function logs for errors

### Issue: Data shows "Failed to fetch"
**Solution**:
1. Check your internet connection
2. Verify API Ninjas service status
3. Try refreshing the data

## 📄 License

MIT License - feel free to use this project for personal or commercial purposes.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📞 Support

For issues or questions:
1. Check the [Troubleshooting](#-troubleshooting) section
2. Review [API Ninjas Documentation](https://api-ninjas.com/api/stockprice)
3. Check [Vercel Documentation](https://vercel.com/docs)

## 🎯 Roadmap

- [ ] Add historical price charts
- [ ] Implement email alerts for price changes
- [ ] Add more market sectors (healthcare, finance, etc.)
- [ ] Include market cap and P/E ratio data
- [ ] Add dark/light theme toggle

---

**Built with ❤️ for business intelligence professionals**
