export const environment = {
  production: false,
  apiUrl: 'http://localhost:8880/product-service/api/products',
  forumApiUrl: 'http://localhost:8880/forum-service/forum',
  orderApiUrl: 'http://localhost:8880/order-service/api/orders',
  eventApiUrl: 'http://localhost:8880/event-service/api/events',
  useMockApi: false,
  keycloak: {
    url: 'http://localhost:8181',
    realm: 'ecommerce-realm',
    clientId: 'ecommerce-client',
  },
};
