class Api::SessionsController < ApplicationController
  def create
    user = User.find_by(email: params[:email])
    if user && user.authenticate(params[:password])
      token = Base64.strict_encode64(user.id.to_s)
      render json: { token: token, user: user_response(user) }
    else
      render json: { error: 'Email atau kata sandi salah' }, status: :unauthorized
    end
  end

  private

  def user_response(user)
    {
      id: user.id,
      email: user.email,
      first_name: user.first_name,
      last_name: user.last_name,
      institution: user.institution,
      role: user.role
    }
  end
end
