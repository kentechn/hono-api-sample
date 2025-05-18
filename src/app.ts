import { Hono } from 'hono';
import articleRouter from './api/articles.js';

const app = new Hono().basePath('/api');

app.get('/', (c) => {
  return c.text('Hello Hono!');
});

app.route('/articles', articleRouter);

export default app;
