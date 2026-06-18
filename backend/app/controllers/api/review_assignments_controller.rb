class Api::ReviewAssignmentsController < ApplicationController
  before_action :authenticate_user!

  def index
    assignments = ReviewAssignment.where(user_id: current_user.id).order(created_at: :desc)
    render json: assignments.map { |ra| assignment_response(ra) }
  end

  def show
    ra = ReviewAssignment.find_by(id: params[:id])
    unless ra
      render json: { error: 'Penugasan tidak ditemukan' }, status: :not_found
      return
    end

    # Auth check: only assigned reviewer or editor/admin can view
    unless ra.user_id == current_user.id || %w[editor admin Editor Admin].include?(current_user.role)
      render json: { error: 'Anda tidak memiliki hak akses' }, status: :forbidden
      return
    end

    render json: assignment_response(ra)
  end

  def update
    ra = ReviewAssignment.find_by(id: params[:id])
    unless ra
      render json: { error: 'Penugasan tidak ditemukan' }, status: :not_found
      return
    end

    # Auth check: only assigned reviewer or editor/admin can edit
    unless ra.user_id == current_user.id || %w[editor admin Editor Admin].include?(current_user.role)
      render json: { error: 'Anda tidak memiliki hak akses' }, status: :forbidden
      return
    end

    if ra.update(assignment_params)
      # If recommendation is submitted, complete the status
      if ra.recommendation.present?
        ra.update!(status: 'completed')
        
        # Check if all review assignments for this article in the current round are completed
        current_round = ra.article.round || 1
        all_completed = ra.article.review_assignments.where(round: current_round).all? { |assign| assign.status == 'completed' }
        if all_completed
          ra.article.update!(status: 'Awaiting Decision')
        end

        # Notify editors
        editors = User.where(role: ['editor', 'Editor', 'admin', 'Admin'])
        editors.each do |editor|
          Notification.create(
            user: editor,
            kind: 'status_change',
            title: 'Ulasan Reviewer Masuk',
            body: "Reviewer #{ra.user.first_name} #{ra.user.last_name} mengirim ulasan untuk \"#{ra.article.title}\". Rekomendasi: #{ra.recommendation.upcase}.",
            link: '/admin/submissions',
            metadata: { article_id: ra.article_id, review_assignment_id: ra.id }
          )
        end
      end

      render json: assignment_response(ra)
    else
      render json: { error: ra.errors.full_messages.join(', ') }, status: :unprocessable_entity
    end
  end

  private

  def file_url_for(article, filename)
    return nil if filename.blank?
    file_path = Rails.root.join('public', 'uploads', 'articles', article.id.to_s, filename)
    if File.exist?(file_path)
      "/api/articles/#{article.id}/files/#{filename}"
    else
      nil
    end
  end

  def assignment_params
    params.permit(:recommendation, :comments, :status, :review_file)
  end

  def assignment_response(ra)
    {
      id: ra.id.to_s,
      article_id: ra.article_id.to_s,
      article_title: ra.article.title,
      article_category: ra.article.category&.name || 'Umum',
      article_file_name: ra.article.file_name,
      article_file_url: file_url_for(ra.article, ra.article.file_name),
      reviewer_name: "#{ra.user.first_name} #{ra.user.last_name}",
      reviewer_institution: ra.user.institution || '-',
      recommendation: ra.recommendation || '',
      comments: ra.comments || '',
      status: ra.status,
      review_file: ra.review_file || '',
      round: ra.round || 1,
      created_at: ra.created_at.iso8601,
      due_date: (ra.created_at + 21.days).iso8601
    }
  end
end
