import { createProxyMiddleware } from 'http-proxy-middleware';

export const userProxy = createProxyMiddleware({
  target: 'http://localhost:8000',
  changeOrigin: true,
});

export const matchingProxy = createProxyMiddleware({
  target: 'http://localhost:8001',
  changeOrigin: true,
  ws: true,
});

export const codingProxy = createProxyMiddleware({
  target: 'http://localhost:8002',
  changeOrigin: true,
  ws: true,
});

export const videoProxy = createProxyMiddleware({
  target: 'http://localhost:8003',
  changeOrigin: true,
  ws: true,
});

export const questionProxy = createProxyMiddleware({
  target: 'http://localhost:8004',
  changeOrigin: true,
  ws: true,
});

export const historyProxy = createProxyMiddleware({
  target: 'http://localhost:8005',
  changeOrigin: true,
  ws: true,
});
