import type { ArticleRepository } from "kernel/repositories/articles.repository.js";

export class ArticlesService {
  constructor(private articleRepository: ArticleRepository) {}

  async getArticles() {
    return this.articleRepository.findAll();
  }
}
