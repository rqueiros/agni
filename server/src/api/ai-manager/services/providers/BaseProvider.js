class BaseProvider {
  constructor({ apiKey, model }) {
    this.apiKey = apiKey;
    this.model = model;
  }

  async generate(prompt) {
    throw new Error("generate() must be implemented");
  }

  safeParse(text) {
    try {
      return JSON.parse(text);
    } catch {
      throw new Error("Invalid JSON from model");
    }
  }
}

module.exports = BaseProvider;