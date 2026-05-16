const GroqProvider = require('../providers/GroqProvider');
const GoogleProvider = require('../providers/GoogleProvider');
const IaeduProvider = require('../providers/IaeduProvider');

function createProvider({ provider, apiKey, model }) {
  switch (provider) {
    case 'groq':
      return new GroqProvider({ apiKey, model });

    case 'google':
      return new GoogleProvider({ apiKey, model });

    case 'iaedu':
    default:
      return new IaeduProvider({ apiKey, model });
  }
}

module.exports = createProvider;