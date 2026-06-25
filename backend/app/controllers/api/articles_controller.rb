class Api::ArticlesController < ApplicationController
  before_action :authenticate_user!, only: [:create, :update, :upload_file]

  def index
    articles = if params[:scope] == 'dashboard'
                 authenticate_user!
                 return if performed?
                 current_user.articles
               elsif params[:scope] == 'reviewer'
                 authenticate_user!
                 return if performed?
                 Article.joins(:review_assignments).where(review_assignments: { user_id: current_user.id })
               elsif params[:scope] == 'admin'
                 authenticate_user!
                 return if performed?
                 unless %w[editor reviewer admin Editor Reviewer Admin].include?(current_user.role)
                   render json: { error: 'Anda tidak memiliki hak akses' }, status: :forbidden
                   return
                 end
                 Article.all
               else
                 Article.where(status: 'Published')
               end

    # Search filter
    if params[:q].present?
      q = "%#{params[:q].downcase}%"
      articles = articles.where('LOWER(title) LIKE ? OR LOWER(abstract) LIKE ?', q, q)
    end

    # Category filter
    if params[:category].present?
      category = Category.find_by(slug: params[:category]) || Category.find_by(name: params[:category])
      articles = articles.where(category_id: category.id) if category
    end

    render json: articles.order(created_at: :desc).map { |a| article_response(a) }
  end

  def show
    article = Article.find_by(id: params[:id])
    if article
      if article.status != 'Published'
        if current_user.nil?
          render json: { error: 'Anda harus masuk untuk melihat naskah ini' }, status: :unauthorized
          return
        end
        unless article.user_id == current_user.id || %w[editor reviewer admin Editor Reviewer Admin].include?(current_user.role)
          render json: { error: 'Anda tidak memiliki hak akses untuk naskah ini' }, status: :forbidden
          return
        end
      end
      render json: article_response(article)
    else
      render json: { error: 'Artikel tidak ditemukan' }, status: :not_found
    end
  end

  def create
    category = Category.find_by(id: params[:category_id]) || Category.find_by(name: params[:category])
    if !category && params[:category_name].present?
      category = Category.find_or_create_by(name: params[:category_name], slug: params[:category_name].parameterize)
    end

    # Default to first category if none provided to prevent crash
    category ||= Category.first

    article = current_user.articles.new(article_params)
    article.category = category
    article.status = 'Submitted'
    article.submitted_at = Time.current

    if article.save
      # Send receipt confirmation message to the author
      system_sender = User.find_by(role: ['editor', 'Editor', 'admin', 'Admin']) || User.first
      if system_sender && system_sender.id != article.user_id
        Message.create(
          sender: system_sender,
          receiver: article.user,
          subject: "Naskah Berhasil Dikirim: #{article.title}",
          body: "Halo #{article.user.first_name},\n\nNaskah Anda yang berjudul \"#{article.title}\" telah berhasil dikirimkan ke FAST-Journal pada tanggal #{Time.current.strftime('%d %B %Y')}.\n\nStatus naskah saat ini: \"#{article.status}\". Tim editor kami akan segera meninjau naskah tersebut.\n\nSalam hangat,\nRedaksi FAST-Journal"
        )
      end

      # Notify all editors about the new submission
      Notification.notify_role('editor', {
        kind: 'assignment',
        title: 'Naskah Baru Masuk',
        body: "Naskah baru berjudul \"#{article.title}\" telah dikirim oleh #{article.user.first_name} #{article.user.last_name}.",
        link: '/admin/submissions',
        metadata: { article_id: article.id }
      })

      render json: article_response(article), status: :created
    else
      render json: { error: article.errors.full_messages.join(', ') }, status: :unprocessable_entity
    end
  end

  def update
    article = Article.find_by(id: params[:id])
    if article
      # Simple auth check: only author or editor/reviewer/admin can update
      if article.user_id == current_user.id || %w[editor reviewer admin Editor Reviewer Admin].include?(current_user.role)
        old_status = article.status
        
        # If the user is the author and status is Revision Required, set to Under Review automatically as they submit the revision
        if article.user_id == current_user.id && old_status == 'Revision Required'
          article.status = 'Under Review'
          article.round = (article.round || 1) + 1
          if params[:revised_file_name].present?
            article.file_name = params[:revised_file_name]
          end
        end

        # Auto-populate editor_notes from reviewer comments if editor didn't provide their own notes
        if %w[editor admin Editor Admin].include?(current_user.role)
          if params[:notes].present?
            params[:editor_notes] = params[:notes]
          elsif params[:editor_notes].blank? && params[:status].present? && params[:status] != old_status
            # Build reviewer summary from completed reviews for the current round
            current_round = article.round || 1
            completed_reviews = article.review_assignments.where(round: current_round, status: 'completed')
            if completed_reviews.any?
              reviewer_summary = completed_reviews.map do |ra|
                rec_label = case ra.recommendation
                            when 'accept' then 'Terima'
                            when 'revision' then 'Perlu Revisi'
                            when 'reject' then 'Tolak'
                            else 'Belum Ada'
                            end
                summary = "• #{ra.user&.first_name} #{ra.user&.last_name} — Rekomendasi: #{rec_label}"
                summary += "\n  Komentar: #{ra.comments}" if ra.comments.present?
                summary
              end.join("\n\n")
              params[:editor_notes] = "[Rangkuman Ulasan Reviewer Ronde #{current_round}]\n\n#{reviewer_summary}"
            end
          end
        end

        if article.update(article_params)
          # Handle Reviewer Assignments
          if params[:reviewer_ids].present? && %w[editor admin Editor Admin].include?(current_user.role)
            # Remove previous assignments for the current round if editor re-assigns
            article.review_assignments.where(round: article.round || 1).destroy_all
            Array(params[:reviewer_ids]).each do |r_id|
              next if r_id.blank?
              ra = article.review_assignments.create(user_id: r_id, round: article.round || 1)
              
              # Notify reviewer
              reviewer = User.find_by(id: r_id)
              if reviewer
                Notification.create(
                  user: reviewer,
                  kind: 'assignment',
                  title: 'Penugasan Tinjauan Baru',
                  body: "Naskah \"#{article.title}\" memerlukan tinjauan Anda.",
                  link: '/dashboard/reviews',
                  metadata: { article_id: article.id, review_assignment_id: ra.id }
                )
              end
            end
          end

          # Send status update notification message
          if article.status != old_status
            if current_user.id != article.user_id
              # Sent by editor to author
              subject = "Pembaruan Status Naskah: #{article.title}"
              body = "Halo #{article.user.first_name},\n\nStatus naskah Anda yang berjudul \"#{article.title}\" telah diperbarui dari \"#{old_status}\" menjadi \"#{article.status}\"."
              if params[:notes].present? && !['Reviewer Assigned', 'Under Review', 'Submitted'].include?(article.status)
                body += "\n\nCatatan Editor:\n#{params[:notes]}"
              end
              body += "\n\nSalam hangat,\nRedaksi FAST-Journal"
              
              Message.create(
                sender: current_user,
                receiver: article.user,
                subject: subject,
                body: body
              )

              # Notification to author about status change
              Notification.create(
                user: article.user,
                kind: 'status_change',
                title: "Status Naskah Berubah",
                body: "Naskah \"#{article.title}\" berubah menjadi \"#{article.status}\".",
                link: '/dashboard/submissions',
                metadata: { article_id: article.id, old_status: old_status, new_status: article.status }
              )
            elsif old_status == 'Revision Required' && article.status == 'Under Review'
              # Sent to both Editor and Author to confirm revision submission
              system_sender = User.find_by(role: ['editor', 'Editor', 'admin', 'Admin']) || User.first
              if system_sender && system_sender.id != article.user_id
                notes_content = params[:revision_notes].present? ? params[:revision_notes] : "Tidak ada keterangan tambahan."
                file_content = params[:revised_file_name].present? ? params[:revised_file_name] : "revisi_naskah.docx"

                # 1. Message from Author to Editor (Notification of revision submission)
                Message.create(
                  sender: article.user,
                  receiver: system_sender,
                  subject: "[Revisi Masuk] Naskah: #{article.title}",
                  body: "Halo Tim Editor,\n\nPenulis #{article.user.first_name} #{article.user.last_name} telah menyerahkan berkas revisi untuk naskah:\n\"#{article.title}\"\n\nNama Berkas: #{file_content}\n\nKeterangan Revisi:\n#{notes_content}"
                )

                # 2. Message from Editor (System) to Author (Receipt confirmation)
                Message.create(
                  sender: system_sender,
                  receiver: article.user,
                  subject: "Revisi Naskah Diterima: #{article.title}",
                  body: "Halo #{article.user.first_name},\n\nTerima kasih, berkas revisi Anda untuk naskah \"#{article.title}\" telah berhasil kami terima.\n\nBerkas: #{file_content}\n\nKeterangan Revisi:\n#{notes_content}\n\nStatus naskah Anda saat ini kembali menjadi \"Under Review\" dan akan segera ditinjau kembali oleh tim redaksi.\n\nSalam hangat,\nRedaksi FAST-Journal"
                )

                # Notification to editors about revision
                Notification.create(
                  user: system_sender,
                  kind: 'status_change',
                  title: 'Revisi Naskah Masuk',
                  body: "#{article.user.first_name} mengirim revisi untuk \"#{article.title}\".",
                  link: '/admin/submissions',
                  metadata: { article_id: article.id }
                )
              end
            end
          end
          render json: article_response(article)
        else
          render json: { error: article.errors.full_messages.join(', ') }, status: :unprocessable_entity
        end
      else
        render json: { error: 'Anda tidak memiliki hak untuk memperbarui naskah ini' }, status: :forbidden
      end
    else
      render json: { error: 'Artikel tidak ditemukan' }, status: :not_found
    end
  end

  def download
    article = Article.find_by(id: params[:id])
    if article
      article.increment!(:downloads)
      render json: { success: true, downloads: article.downloads }
    else
      render json: { error: 'Artikel tidak ditemukan' }, status: :not_found
    end
  end

  def upload_file
    article = Article.find_by(id: params[:id])
    if article.nil?
      render json: { error: 'Artikel tidak ditemukan' }, status: :not_found
      return
    end

    file = params[:file]
    unless file.is_a?(ActionDispatch::Http::UploadedFile)
      render json: { error: 'File tidak valid' }, status: :unprocessable_entity
      return
    end

    # Create upload directory
    upload_dir = Rails.root.join('public', 'uploads', 'articles', article.id.to_s)
    FileUtils.mkdir_p(upload_dir)

    # Sanitize filename
    safe_name = file.original_filename.gsub(/[^\w.\-]/, '_')
    file_path = upload_dir.join(safe_name)

    File.open(file_path, 'wb') do |f|
      f.write(file.read)
    end

    # Update article field based on file_type param
    case params[:file_type]
    when 'loa'
      article.update(loa_file: safe_name)
    when 'final'
      article.update(file_name: safe_name)
    when 'copyedit'
      article.update(file_name: safe_name)
    end

    render json: { success: true, filename: safe_name, url: "/uploads/articles/#{article.id}/#{safe_name}" }
  end

  def serve_file
    article = Article.find_by(id: params[:id])
    if article.nil?
      render json: { error: 'Artikel tidak ditemukan' }, status: :not_found
      return
    end

    filename = params[:filename]
    file_path = Rails.root.join('public', 'uploads', 'articles', article.id.to_s, filename)

    unless File.exist?(file_path)
      render json: { error: 'File tidak ditemukan' }, status: :not_found
      return
    end

    content_type = case File.extname(filename).downcase
                   when '.pdf' then 'application/pdf'
                   when '.doc' then 'application/msword'
                   when '.docx' then 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
                   else 'application/octet-stream'
                   end

    # For PDFs, serve inline so they open in browser; others download
    disposition = File.extname(filename).downcase == '.pdf' ? 'inline' : 'attachment'
    send_file file_path, type: content_type, disposition: disposition, filename: filename
  end

  def view
    article = Article.find_by(id: params[:id])
    if article
      article.increment!(:views)
      render json: { success: true, views: article.views }
    else
      render json: { error: 'Artikel tidak ditemukan' }, status: :not_found
    end
  end

  private

  def article_params
    if current_user && %w[editor reviewer admin Editor Reviewer Admin].include?(current_user.role)
      params.permit(:title, :abstract, :authors, :keywords, :status, :doi, :volume, :issue, :category_id, :file_name, :references, :issue_id, :body_text, :loa_file, :editor_notes)
    else
      # Author is not allowed to manually update status or assign issues via body parameters
      params.permit(:title, :abstract, :authors, :keywords, :category_id, :file_name, :references, :body_text)
    end
  end

  def file_url_for(article, filename)
    return nil if filename.blank?
    file_path = Rails.root.join('public', 'uploads', 'articles', article.id.to_s, filename)
    if File.exist?(file_path)
      "/api/articles/#{article.id}/files/#{filename}"
    else
      nil
    end
  end

  def article_response(article)
    {
      id: article.id.to_s,
      title: article.title,
      abstract: article.abstract,
      authors: article.authors.to_s.split(',').map(&:strip),
      category: article.category&.name || 'Umum',
      keywords: article.keywords.to_s.split(',').map(&:strip),
      references: article.references || '',
      body_text: article.body_text || '',
      submittedAt: article.submitted_at&.strftime('%Y-%m-%d'),
      publishedAt: article.published_at&.strftime('%Y-%m-%d') || (article.issue&.published_at || article.created_at)&.strftime('%Y-%m-%d'),
      status: article.status,
      doi: article.display_doi,
      views: article.views,
      downloads: article.downloads,
      issue: article.display_issue,
      volume: article.display_volume,
      year: article.display_year,
      pages: article.pages || '',
      user_id: article.user_id,
      round: article.round || 1,
      file_name: article.file_name,
      file_url: file_url_for(article, article.file_name),
      loa_file: article.loa_file || '',
      loa_file_url: file_url_for(article, article.loa_file),
      editor_notes: article.editor_notes || '',
      issue_id: article.issue_id,
      review_assignments: article.review_assignments.map { |ra|
        {
          id: ra.id.to_s,
          article_id: ra.article_id.to_s,
          reviewer_name: "#{ra.user&.first_name} #{ra.user&.last_name}",
          reviewer_institution: ra.user&.institution || '-',
          recommendation: ra.recommendation || '',
          comments: ra.comments || '',
          review_file: ra.review_file || '',
          status: ra.status,
          round: ra.round || 1,
          created_at: ra.created_at.iso8601
        }
      }
    }
  end
end
