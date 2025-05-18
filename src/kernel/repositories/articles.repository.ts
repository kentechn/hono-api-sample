import type { Article } from "generated/prisma/client.js";

export interface ArticleRepository {
  findAll(): Promise<Article[]>
}
