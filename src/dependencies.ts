import { Dependency } from "hono-simple-di";
import { ArticlesService } from "kernel/services/articles.service.js";
import { ArticleRepositoryImpl } from "adapter/repositories/articles.repository.js";

export const articlesRepositoryDep = new Dependency(() => new ArticleRepositoryImpl());
export const articlesServiceDep = new Dependency(async (c) => new ArticlesService(await articlesRepositoryDep.resolve(c)));
