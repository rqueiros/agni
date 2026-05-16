module.exports = {
  routes: [
    {
      method: 'GET',
      path: '/ai-manager',
      handler: 'ai-manager.getHandler',
      config: {
        auth: false,
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'POST',
      path: '/ai-manager',
      handler: 'ai-manager.updateHandler',
      config: {
        auth: false,
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'GET',
      path: '/ai-manager/hint',
      handler: 'ai-manager.getHintHandler',
      config: {
        auth: false,
        policies: [],
        middlewares: [],
      },
    },
  ],
};
