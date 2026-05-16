const BaseProvider = require('./BaseProvider');
const Groq = require('groq-sdk');

class GroqProvider extends BaseProvider {
  async generate(prompt) {
    const groq = new Groq({ apiKey: this.apiKey });

    const res = await groq.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: this.model,
    });

    return this.safeParse(res.choices[0]?.message?.content);
  }
}

module.exports = GroqProvider;