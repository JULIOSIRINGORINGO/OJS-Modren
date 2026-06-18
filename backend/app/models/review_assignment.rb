class ReviewAssignment < ApplicationRecord
  belongs_to :article
  belongs_to :user

  validates :status, presence: true, inclusion: { in: ['pending', 'completed'] }
  validates :recommendation, inclusion: { in: ['accept', 'revision', 'reject'] }, allow_nil: true

  before_validation :set_default_status, on: :create

  private

  def set_default_status
    self.status ||= 'pending'
  end
end
