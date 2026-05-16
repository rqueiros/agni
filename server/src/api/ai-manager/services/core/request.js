const createProvider = require('./providerFactory');

async function request({ provider, apiKey, model, prompt }) {
  const instance = createProvider({ provider, apiKey, model });
  
  try {
    return await instance.generate(prompt);
  } catch (err) {
    throw err;
  }
}

module.exports = request;