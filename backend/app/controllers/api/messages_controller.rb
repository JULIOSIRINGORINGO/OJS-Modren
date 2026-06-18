class Api::MessagesController < ApplicationController
  before_action :authenticate_user!

  def index
    # Get all received and sent messages
    received = current_user.received_messages.order(created_at: :desc)
    sent = current_user.sent_messages.order(created_at: :desc)

    render json: {
      received: received.map { |m| message_response(m) },
      sent: sent.map { |m| message_response(m) }
    }
  end

  def show
    message = Message.find_by(id: params[:id])
    if message
      if message.sender_id == current_user.id || message.receiver_id == current_user.id
        message.update(read: true) if message.receiver_id == current_user.id && !message.read
        render json: message_response(message)
      else
        render json: { error: 'Akses ditolak' }, status: :forbidden
      end
    else
      render json: { error: 'Pesan tidak ditemukan' }, status: :not_found
    end
  end

  def create
    # Find receiver by email or id
    receiver = User.find_by(email: params[:receiver_email]) || User.find_by(id: params[:receiver_id])
    
    # If no receiver specified, send to editorial (first Editor)
    receiver ||= User.find_by(role: ['editor', 'Editor']) || User.first

    message = current_user.sent_messages.new(
      receiver: receiver,
      subject: params[:subject],
      body: params[:body]
    )

    if message.save
      render json: message_response(message), status: :created
    else
      render json: { error: message.errors.full_messages.join(', ') }, status: :unprocessable_entity
    end
  end

  private

  def message_response(msg)
    {
      id: msg.id.to_s,
      sender: {
        id: msg.sender&.id,
        name: "#{msg.sender&.first_name} #{msg.sender&.last_name}",
        email: msg.sender&.email
      },
      receiver: {
        id: msg.receiver&.id,
        name: "#{msg.receiver&.first_name} #{msg.receiver&.last_name}",
        email: msg.receiver&.email
      },
      subject: msg.subject,
      body: msg.body,
      read: msg.read,
      createdAt: msg.created_at&.strftime('%Y-%m-%d %H:%M:%S')
    }
  end
end
