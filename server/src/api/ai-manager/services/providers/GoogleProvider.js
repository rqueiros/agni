const BaseProvider = require('./BaseProvider');

class GoogleProvider extends BaseProvider {
  async generate(prompt) {
    const { GoogleGenAI } = await import('@google/genai');
    const ai = new GoogleGenAI({ apiKey: this.apiKey });

    const response = await ai.models.generateContent({
        model: this.model,
        contents: prompt,
    });

    return this.safeParse(response.text);
  }
}

module.exports = GoogleProvider;