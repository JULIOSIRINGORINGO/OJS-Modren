class Api::BookmarksController < ApplicationController
  before_action :authenticate_user!

  def index
    bookmarks = current_user.bookmarks.includes(:article).map do |b|
      next unless b.article
      {
        id: b.id.to_s,
        article: article_response(b.article)
      }
    end.compact
    render json: bookmarks
  end

  def create
    article = Article.find_by(id: params[:article_id])
    if article
      bookmark = current_user.bookmarks.find_or_initialize_by(article: article)
      if bookmark.save
        render json: { success: true, id: bookmark.id.to_s, article: article_response(article) }, status: :created
      else
        render json: { error: bookmark.errors.full_messages.join(', ') }, status: :unprocessable_entity
      end
    else
      render json: { error: 'Artikel tidak ditemukan' }, status: :not_found
    end
  end

  def destroy
    bookmark = current_user.bookmarks.find_by(id: params[:id]) || current_user.bookmarks.find_by(article_id: params[:id])
    if bookmark
      bookmark.destroy
      render json: { success: true }
    else
      render json: { error: 'Bookmark tidak ditemukan' }, status: :not_found
    end
  end

  private

  def article_response(article)
    {
      id: article.id.to_s,
      title: article.title,
      abstract: article.abstract,
      authors: article.authors.to_s.split(',').map(&:strip),
      category: article.category&.name || 'Umum',
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
