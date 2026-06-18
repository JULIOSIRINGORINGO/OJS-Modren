class ApplicationController < ActionController::API
  def current_user
    @current_user ||= begin
      auth_header = request.headers['Authorization']
      if auth_header.present? && auth_header.start_with?('Bearer ')
        token = auth_header.split(' ').last
        # Decode the user_id from Base64 (fallback to raw if not base64)
        user_id = begin
          Base64.strict_decode64(token)
        rescue StandardError
          token
        end
        User.find_by(id: user_id)
      end
    end
  end

  def authenticate_user!
    render json: { error: 'Not Authorized' }, status: :unauthorized unless current_user
  end
end
