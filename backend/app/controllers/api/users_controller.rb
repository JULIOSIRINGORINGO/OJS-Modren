class Api::UsersController < ApplicationController
  before_action :authenticate_user!, only: [:show, :index, :update]

  def index
    unless %w[admin editor Admin Editor].include?(current_user.role)
      render json: { error: 'Anda tidak memiliki hak akses' }, status: :forbidden
      return
    end
    users = User.all.order(:created_at)
    render json: users.map { |u|
      {
        id: u.id,
        name: "#{u.first_name} #{u.last_name}",
        email: u.email,
        institution: u.institution || '-',
        role: u.role.capitalize,
        articleCount: u.articles.count,
        joinedAt: u.created_at.iso8601
      }
    }
  end

  def create
    user = User.new(user_params)
    if user.save
      token = Base64.strict_encode64(user.id.to_s)
      render json: { token: token, user: user_response(user) }, status: :created
    else
      render json: { error: user.errors.full_messages.join(', ') }, status: :unprocessable_entity
    end
  end

  def show
    render json: { user: user_response(current_user) }
  end

  def update
    update_params = profile_params.to_h
    update_params.delete("password") if update_params["password"].blank?

    if current_user.update(update_params)
      render json: { user: user_response(current_user) }
    else
      render json: { error: current_user.errors.full_messages.join(', ') }, status: :unprocessable_entity
    end
  end

  private

  def user_params
    # Permit directly from root params to avoid ParamsWrapper password omissions
    params.permit(:first_name, :last_name, :email, :password, :institution, :role)
  end

  def profile_params
    params.permit(:first_name, :last_name, :email, :institution, :bio, :orcid, :avatar, :password)
  end

  def user_response(user)
    {
      id: user.id,
      email: user.email,
      first_name: user.first_name,
      last_name: user.last_name,
      institution: user.institution,
      role: user.role,
      bio: user.try(:bio) || '',
      orcid: user.try(:orcid) || '',
      avatar: user.try(:avatar) || ''
    }
  end
end
