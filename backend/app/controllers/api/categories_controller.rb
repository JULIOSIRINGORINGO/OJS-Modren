class Api::CategoriesController < ApplicationController
  def index
    categories = Category.all.map do |cat|
      {
        id: cat.id,
        name: cat.name,
        slug: cat.slug,
        icon: cat.icon,
        count: cat.articles.where(status: 'Published').count
      }
    end
    render json: categories
  end

  def show
    category = Category.find_by(id: params[:id]) || Category.find_by(slug: params[:id])
    if category
      articles = category.articles.where(status: 'Published').map { |a| article_response(a) }
      render json: {
        category: {
          id: category.id,
          name: category.name,
          slug: category.slug,
          icon: category.icon,
          count: category.articles.where(status: 'Published').count
        },
        articles: articles
      }
    else
      render json: { error: 'Kategori tidak ditemukan' }, status: :not_found
    end
  end

  private

  def article_response(article)
    {
      id: article.id.to_s,
      title: article.title,
      abstract: article.abstract,
      authors: article.authors.to_s.split(',').map(&:strip),
      category: article.category.name,
      keywords: article.keywords.to_s.split(',').map(&:strip),
      submittedAt: article.submitted_at&.strftime('%Y-%m-%d'),
      publishedAt: article.published_at&.strftime('%Y-%m-%d'),
      status: article.status,
      doi: article.doi,
      views: article.views,
      downloads: article.downloads,
      issue: article.issue,
      volume: article.volume
    }
  end
end
