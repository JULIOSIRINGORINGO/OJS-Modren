class Api::IssuesController < ApplicationController
  before_action :authenticate_user!, only: [:create, :update, :destroy, :publish]

  def index
    # Editors/admins can see all issues, guests/authors only see published issues
    issues = if current_user && %w[editor admin Editor Admin].include?(current_user.role)
               Issue.all.order(created_at: :desc)
             else
               Issue.where(status: 'published').order(published_at: :desc)
             end

    render json: issues.map { |i| issue_response(i) }
  end

  def show
    issue = Issue.find_by(id: params[:id])
    if issue
      if issue.status == 'draft'
        if current_user.nil? || !%w[editor admin Editor Admin].include?(current_user.role)
          render json: { error: 'Anda tidak memiliki hak akses' }, status: :forbidden
          return
        end
      end
      render json: issue_response(issue)
    else
      render json: { error: 'Edisi tidak ditemukan' }, status: :not_found
    end
  end

  def create
    unless %w[editor admin Editor Admin].include?(current_user.role)
      render json: { error: 'Anda tidak memiliki hak akses' }, status: :forbidden
      return
    end

    issue = Issue.new(issue_params)
    if issue.save
      render json: issue_response(issue), status: :created
    else
      render json: { error: issue.errors.full_messages.join(', ') }, status: :unprocessable_entity
    end
  end

  def update
    unless %w[editor admin Editor Admin].include?(current_user.role)
      render json: { error: 'Anda tidak memiliki hak akses' }, status: :forbidden
      return
    end

    issue = Issue.find_by(id: params[:id])
    if issue
      # Handle assigning articles if passed
      if params[:article_ids].present?
        # Reset previous articles' issue_id
        issue.articles.update_all(issue_id: nil)
        Article.where(id: params[:article_ids]).update_all(issue_id: issue.id)
      end

      if issue.update(issue_params)
        render json: issue_response(issue)
      else
        render json: { error: issue.errors.full_messages.join(', ') }, status: :unprocessable_entity
      end
    else
      render json: { error: 'Edisi tidak ditemukan' }, status: :not_found
    end
  end

  def destroy
    unless %w[editor admin Editor Admin].include?(current_user.role)
      render json: { error: 'Anda tidak memiliki hak akses' }, status: :forbidden
      return
    end

    issue = Issue.find_by(id: params[:id])
    if issue
      issue.destroy
      render json: { success: true }
    else
      render json: { error: 'Edisi tidak ditemukan' }, status: :not_found
    end
  end

  def publish
    unless %w[editor admin Editor Admin].include?(current_user.role)
      render json: { error: 'Anda tidak memiliki hak akses' }, status: :forbidden
      return
    end

    issue = Issue.find_by(id: params[:id])
    if issue
      if issue.update(status: 'published', published_at: Time.current)
        # Update all articles associated
        issue.articles.each do |article|
          article.update!(
            status: 'Published',
            published_at: Time.current,
            volume: issue.volume,
            issue: issue.number
          )
        end
        render json: issue_response(issue)
      else
        render json: { error: issue.errors.full_messages.join(', ') }, status: :unprocessable_entity
      end
    else
      render json: { error: 'Edisi tidak ditemukan' }, status: :not_found
    end
  end

  private

  def issue_params
    params.permit(:volume, :number, :year, :title, :description, :status)
  end

  def issue_response(issue)
    {
      id: issue.id.to_s,
      volume: issue.volume,
      number: issue.number,
      year: issue.year,
      title: issue.title,
      description: issue.description || '',
      status: issue.status,
      published_at: issue.published_at&.iso8601,
      articlesCount: issue.articles.count,
      articles: issue.articles.map { |a|
        {
          id: a.id.to_s,
          title: a.title,
          authors: a.authors.to_s.split(',').map(&:strip),
          status: a.status
        }
      }
    }
  end
end
