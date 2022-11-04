import { createProxyMiddleware } from 'http-proxy-middleware';

export const userProxy = createProxyMiddleware({
  target: process.env.USER_URL,
  changeOrigin: true,
});

export const matchingProxy = createProxyMiddleware('/matching', {
  target: process.env.MATCHING_URL,
  changeOrigin: true,
  ws: true,
});

export const codingProxy = createProxyMiddleware('/coding', {
  target: process.env.CODING_URL,
  changeOrigin: true,
  ws: true,
});

export const videoProxy = createProxyMiddleware({
  target: process.env.VIDEO_URL,
  changeOrigin: true,
});

export const questionProxy = createProxyMiddleware({
  target: process.env.QUESTION_URL,
  changeOrigin: true,
});

export const historyProxy = createProxyMiddleware({
  target: process.env.HISTORY_URL,
  changeOrigin: true,
});
