class User < ApplicationRecord
  has_secure_password

  has_many :articles, dependent: :destroy
  has_many :bookmarks, dependent: :destroy
  has_many :bookmarked_articles, through: :bookmarks, source: :article
  has_many :sent_messages, class_name: 'Message', foreign_key: 'sender_id', dependent: :destroy
  has_many :received_messages, class_name: 'Message', foreign_key: 'receiver_id', dependent: :destroy
  has_many :notifications, dependent: :destroy

  validates :first_name, :last_name, presence: true
  validates :email, presence: true, uniqueness: true, format: { with: URI::MailTo::EMAIL_REGEXP }
  validates :role, presence: true, inclusion: { in: %w[author reviewer editor reader Author Reviewer Editor Reader] }
end
