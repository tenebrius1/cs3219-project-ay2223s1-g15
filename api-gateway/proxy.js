import { createProxyMiddleware } from 'http-proxy-middleware';

const API_PREFIX = process.env.ENV  === "PROD" ? process.env.API_PREFIX : "";

export const userProxy = createProxyMiddleware({
  target: process.env.USER_URL,
});

export const matchingProxy = createProxyMiddleware(`/matching`, {
  target: process.env.MATCHING_URL,
  ws: true,
});

export const codingProxy = createProxyMiddleware(`/coding`, {
  target: process.env.CODING_URL,
  ws: true,
});

export const videoProxy = createProxyMiddleware({
  target: process.env.VIDEO_URL,
});

export const questionProxy = createProxyMiddleware({
  target: process.env.QUESTION_URL,
});

export const historyProxy = createProxyMiddleware({
  target: process.env.HISTORY_URL,
});

export const roomProxy = createProxyMiddleware('/room', {
  target: process.env.ROOM_URL,
  changeOrigin: true,
  ws: true,
});
