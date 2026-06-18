class Setting < ApplicationRecord
  validates :key, presence: true, uniqueness: true

  def self.get(key_name, default_value = nil)
    record = find_by(key: key_name)
    record ? record.value : default_value
  end

  def self.set(key_name, val)
    record = find_or_initialize_by(key: key_name)
    record.value = val
    record.save!
    record
  end
end
