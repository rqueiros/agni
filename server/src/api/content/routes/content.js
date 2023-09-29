module.exports = {
  routes: [
    {
      method: 'GET',
      path: '/content',
      handler: 'content.find',
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'POST',
      path: '/gpt',
      handler: 'content.sendPrompt',
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'POST',
      path: '/sendEmail',
      handler: 'content.sendEmail',
      config: {
        policies: [],
        middlewares: [],
      },
    }
  ],
};
