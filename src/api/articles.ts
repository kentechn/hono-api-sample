import { Hono } from 'hono';
import { articlesServiceDep } from 'dependencies.js';
import type { ArticlesService } from 'kernel/services/articles.service.js';

declare module 'hono' {
  interface ContextVariableMap {
    articlesService: ArticlesService;
  }
}

const articleRouter = new Hono();

articleRouter.use(articlesServiceDep.middleware("articlesService"));


articleRouter.get('/', async (c) => {
  // const { userService } = c.var;
  // userService.findAll()
  const articlesService = c.get('articlesService')

  const articles = await articlesService.getArticles()
  
  return c.json({
    data: articles,
  });
});

export default articleRouter;