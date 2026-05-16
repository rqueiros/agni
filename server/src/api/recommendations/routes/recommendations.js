module.exports = {
  routes: [
     {
      method: 'POST',
      path: '/recommendations/failure',
      handler: 'recommendations.onFailure',
      config: {
        auth: false,
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'GET',
      path: '/recommendations/:userId',
      handler: 'recommendations.forStudent',
      config: {
        auth: false,
        policies: [],
        middlewares: [],
      },
    },
  ],
};
