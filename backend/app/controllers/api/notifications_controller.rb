class Api::NotificationsController < ApplicationController
  before_action :authenticate_user!

  # GET /api/notifications
  def index
    return if performed?
    notifications = current_user.notifications.recent
    render json: notifications.map { |n| notification_response(n) }
  end

  # GET /api/notifications/unread_count
  def unread_count
    return if performed?
    count = current_user.notifications.unread.count
    render json: { unread_count: count }
  end

  # PATCH /api/notifications/:id/read
  def mark_read
    return if performed?
    notification = current_user.notifications.find_by(id: params[:id])
    if notification
      notification.update!(read: true)
      render json: { success: true }
    else
      render json: { error: 'Notifikasi tidak ditemukan' }, status: :not_found
    end
  end

  # POST /api/notifications/read_all
  def read_all
    return if performed?
    current_user.notifications.unread.update_all(read: true)
    render json: { success: true }
  end

  private

  def notification_response(n)
    {
      id: n.id.to_s,
      kind: n.kind,
      title: n.title,
      body: n.body,
      read: n.read,
      link: n.link,
      metadata: n.metadata,
      createdAt: n.created_at.iso8601
    }
  end
end
