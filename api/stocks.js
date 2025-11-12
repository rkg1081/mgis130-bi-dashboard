/**
 * Serverless Function: Stock Price API
 * Fetches competitor stock data from API Ninjas Stock Price endpoint
 * Designed for deployment on Vercel
 *
 * Environment Variables Required:
 * - API_KEY: Your API Ninjas API key
 */

// Company ticker mappings for tracked competitors
const COMPANIES = {
  AAPL: 'Apple Inc.',
  MSFT: 'Microsoft Corporation',
  GOOGL: 'Alphabet Inc. (Google)',
  META: 'Meta Platforms Inc.',
  AMZN: 'Amazon.com Inc.'
};

/**
 * Fetches stock price data for a specific ticker
 * @param {string} ticker - Stock ticker symbol
 * @param {string} apiKey - API Ninjas API key
 * @returns {Promise<Object>} Stock data including price and ticker
 */
async function fetchStockPrice(ticker, apiKey) {
  const url = `https://api.api-ninjas.com/v1/stockprice?ticker=${ticker}`;

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'X-Api-Key': apiKey,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`API request failed for ${ticker}: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    // Validate that we received price data
    if (!data || typeof data.price !== 'number') {
      throw new Error(`Invalid data received for ${ticker}`);
    }

    return {
      ticker: ticker,
      companyName: COMPANIES[ticker],
      price: data.price,
      success: true
    };
  } catch (error) {
    console.error(`Error fetching ${ticker}:`, error.message);
    return {
      ticker: ticker,
      companyName: COMPANIES[ticker],
      price: null,
      success: false,
      error: error.message
    };
  }
}

/**
 * Main serverless function handler
 * Fetches all competitor stock data and returns formatted JSON
 */
export default async function handler(req, res) {
  // Enable CORS for frontend access
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Only accept GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({
      error: 'Method not allowed',
      message: 'Only GET requests are supported'
    });
  }

  try {
    // Validate API key is configured
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
      console.error('API_KEY environment variable is not configured');
      return res.status(500).json({
        error: 'Server configuration error',
        message: 'API key not configured. Please set API_KEY environment variable.'
      });
    }

    // Fetch all stock prices concurrently for better performance
    const tickers = Object.keys(COMPANIES);
    const stockPromises = tickers.map(ticker => fetchStockPrice(ticker, apiKey));
    const results = await Promise.all(stockPromises);

    // Filter successful results and failed results
    const successfulResults = results.filter(r => r.success);
    const failedResults = results.filter(r => !r.success);

    // If all requests failed, return error
    if (successfulResults.length === 0) {
      return res.status(503).json({
        error: 'Service unavailable',
        message: 'Unable to fetch stock data from API',
        details: failedResults.map(r => ({ ticker: r.ticker, error: r.error }))
      });
    }

    // Prepare response data
    const responseData = {
      timestamp: new Date().toISOString(),
      stocks: successfulResults.map(result => ({
        ticker: result.ticker,
        companyName: result.companyName,
        price: result.price
      })),
      metadata: {
        total: tickers.length,
        successful: successfulResults.length,
        failed: failedResults.length
      }
    };

    // Include partial failure information if some requests failed
    if (failedResults.length > 0) {
      responseData.warnings = failedResults.map(r => ({
        ticker: r.ticker,
        companyName: r.companyName,
        message: 'Failed to fetch data'
      }));
    }

    // Return successful response
    return res.status(200).json(responseData);

  } catch (error) {
    // Handle unexpected errors
    console.error('Unexpected error in stocks API:', error);
    return res.status(500).json({
      error: 'Internal server error',
      message: 'An unexpected error occurred while fetching stock data',
      details: error.message
    });
  }
}
