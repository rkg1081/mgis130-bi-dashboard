/**
 * Serverless Function: Earnings Call Transcripts API
 * Fetches earnings call transcripts from API Ninjas
 * Designed for deployment on Vercel
 *
 * Environment Variables Required:
 * - API_KEY: Your API Ninjas API key
 */

// Company ticker mappings
const COMPANIES = {
  AAPL: 'Apple Inc.',
  MSFT: 'Microsoft Corporation',
  GOOGL: 'Alphabet Inc. (Google)',
  META: 'Meta Platforms Inc.',
  AMZN: 'Amazon.com Inc.'
};

/**
 * Fetches earnings call transcript for a specific ticker
 * @param {string} ticker - Stock ticker symbol
 * @param {string} apiKey - API Ninjas API key
 * @returns {Promise<Object>} Transcript data
 */
async function fetchEarningsTranscript(ticker, apiKey) {
  const url = `https://api.api-ninjas.com/v1/earningstranscript?ticker=${ticker}`;

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

    // Validate that we received transcript data
    if (!data || !data.transcript) {
      throw new Error(`No transcript data available for ${ticker}`);
    }

    return {
      ticker: ticker,
      companyName: COMPANIES[ticker],
      date: data.date,
      timestamp: data.timestamp,
      year: data.year,
      quarter: data.quarter,
      earningsTiming: data.earnings_timing,
      transcript: data.transcript,
      participants: data.participants || [],
      transcriptSplit: data.transcript_split || [],
      success: true
    };
  } catch (error) {
    console.error(`Error fetching transcript for ${ticker}:`, error.message);
    return {
      ticker: ticker,
      companyName: COMPANIES[ticker],
      success: false,
      error: error.message
    };
  }
}

/**
 * Main serverless function handler
 * Fetches earnings call transcript for requested ticker
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

    // Get ticker from query parameters
    const { ticker } = req.query;

    // If no ticker specified, return available tickers
    if (!ticker) {
      return res.status(200).json({
        message: 'Provide a ticker parameter to fetch transcript',
        availableTickers: Object.keys(COMPANIES),
        example: '/api/transcripts?ticker=MSFT'
      });
    }

    // Validate ticker
    const upperTicker = ticker.toUpperCase();
    if (!COMPANIES[upperTicker]) {
      return res.status(400).json({
        error: 'Invalid ticker',
        message: `Ticker '${ticker}' is not supported`,
        availableTickers: Object.keys(COMPANIES)
      });
    }

    // Fetch transcript
    const result = await fetchEarningsTranscript(upperTicker, apiKey);

    // Check if request failed
    if (!result.success) {
      return res.status(503).json({
        error: 'Service unavailable',
        message: `Unable to fetch transcript for ${upperTicker}`,
        details: result.error
      });
    }

    // Return successful response
    return res.status(200).json({
      success: true,
      data: {
        ticker: result.ticker,
        companyName: result.companyName,
        date: result.date,
        timestamp: result.timestamp,
        year: result.year,
        quarter: result.quarter,
        earningsTiming: result.earningsTiming,
        transcript: result.transcript,
        participants: result.participants,
        transcriptSplit: result.transcriptSplit
      }
    });

  } catch (error) {
    // Handle unexpected errors
    console.error('Unexpected error in transcripts API:', error);
    return res.status(500).json({
      error: 'Internal server error',
      message: 'An unexpected error occurred while fetching transcript data',
      details: error.message
    });
  }
}
