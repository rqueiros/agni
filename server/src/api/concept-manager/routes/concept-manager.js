module.exports = {
  routes: [
    {
      method: 'POST',
      path: '/concept-manager',
      handler: 'concept-manager.createHandler',
      config: {
        auth: false,
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'PUT',
      path: '/concept-manager',
      handler: 'concept-manager.updateHandler',
      config: {
        auth: false,
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'POST',
      path: '/concept-manager/delete-graph',
      handler: 'concept-manager.deleteHandler',
      config: {
        auth: false,
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'POST',
      path: '/concept-manager/delete-concept',
      handler: 'concept-manager.deleteConceptHandler',
      config: {
        auth: false,
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'GET',
      path: '/concept-manager/concepts',
      handler: 'concept-manager.getHandler',
      config: {
        auth: false,
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'GET',
      path: '/concept-manager/course-concepts',
      handler: 'concept-manager.getCourseHandler',
      config: {
        auth: false,
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'GET',
      path: '/concept-manager/all',
      handler: 'concept-manager.getAllHandler',
      config: {
        auth: false,
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'POST',
      path: '/concept-manager/concept',
      handler: 'concept-manager.createConceptHandler',
      config: {
        auth: false,
        policies: [],
        middlewares: [],
      },
    },
  ],
};
