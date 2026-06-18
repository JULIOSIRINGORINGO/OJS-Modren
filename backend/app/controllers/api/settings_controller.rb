class Api::SettingsController < ApplicationController
  # GET /api/settings/:key
  def show
    val = Setting.get(params[:key])
    render json: { key: params[:key], value: val }
  end

  # PATCH/PUT /api/settings/:key
  def update
    require_editor_or_admin!
    return if performed?

    if Setting.set(params[:key], params[:value])
      render json: { message: 'Pengaturan berhasil diperbarui', key: params[:key], value: params[:value] }
    else
      render json: { error: 'Gagal memperbarui pengaturan' }, status: :unprocessable_entity
    end
  end

  private

  def require_editor_or_admin!
    authenticate_user!
    return if performed?
    unless current_user.role&.downcase == 'editor' || current_user.role&.downcase == 'admin'
      render json: { error: 'Akses ditolak' }, status: :forbidden
    end
  end
end
