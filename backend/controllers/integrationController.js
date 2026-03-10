const Integration = require('../models/Integration');

exports.getIntegrations = async (req, res) => {
  try {
    const data = await Integration.findOne({ userId: req.user.id });
    res.json(data || {});
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.saveIntegration = async (req, res) => {
  try {
    const { newsapi, openweather, alphavantage, city } = req.body;
    await Integration.findOneAndUpdate(
      { userId: req.user.id },
      { newsapi, openweather, alphavantage, city, updatedAt: new Date() },
      { upsert: true, new: true }
    );
    res.json({ message: 'Saved successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getLiveData = async (req, res) => {
  try {
    const integration = await Integration.findOne({ userId: req.user.id });
    if (!integration) return res.json({ news: [], weather: null, stocks: [] });

    const results = { news: [], weather: null, stocks: [] };

    // Fetch News
    if (integration.newsapi) {
      try {
        const response = await fetch(
          `https://newsapi.org/v2/top-headlines?category=business&pageSize=5&apiKey=${integration.newsapi}`
        );
        const data = await response.json();
        results.news = data.articles?.slice(0, 5) || [];
      } catch {}
    }

    // Fetch Weather
    if (integration.openweather) {
      try {
        const city = integration.city || 'Mumbai';
        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${integration.openweather}&units=metric`
        );
        const data = await response.json();
        results.weather = {
          city: data.name,
          temp: Math.round(data.main?.temp),
          feels: Math.round(data.main?.feels_like),
          humidity: data.main?.humidity,
          description: data.weather?.[0]?.description,
          icon: data.weather?.[0]?.main
        };
      } catch {}
    }

    // Fetch Stocks
    if (integration.alphavantage) {
      try {
        const symbols = ['IBM', 'AAPL', 'GOOGL'];
        const stockData = await Promise.all(
          symbols.map(async (symbol) => {
            const response = await fetch(
              `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${integration.alphavantage}`
            );
            const data = await response.json();
            const quote = data['Global Quote'];
            return {
              symbol,
              price: parseFloat(quote?.['05. price'] || 0).toFixed(2),
              change: parseFloat(quote?.['09. change'] || 0).toFixed(2),
              changePercent: quote?.['10. change percent']?.replace('%', '') || '0'
            };
          })
        );
        results.stocks = stockData;
      } catch {}
    }

    res.json(results);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};