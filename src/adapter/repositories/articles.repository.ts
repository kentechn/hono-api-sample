import type { ArticleRepository } from "kernel/repositories/index.js";
import db from "adapter/db/database.js";

export class ArticleRepositoryImpl implements ArticleRepository {
  async findAll() {
    return await db.article.findMany()
  }
}
