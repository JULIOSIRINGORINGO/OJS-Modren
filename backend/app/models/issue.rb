class Issue < ApplicationRecord
  has_many :articles, dependent: :nullify

  validates :volume, :number, :year, presence: true
  validates :status, presence: true, inclusion: { in: ['draft', 'published'] }

  before_validation :set_default_status, on: :create

  private

  def set_default_status
    self.status ||= 'draft'
  end
end
