class Notification < ApplicationRecord
  belongs_to :user

  scope :unread, -> { where(read: false) }
  scope :recent, -> { order(created_at: :desc).limit(20) }

  validates :title, :kind, presence: true

  # Helper to create notifications for all users with a given role
  def self.notify_role(role, attrs)
    User.where("LOWER(role) = ?", role.downcase).find_each do |user|
      create!(attrs.merge(user: user))
    end
  end
end
