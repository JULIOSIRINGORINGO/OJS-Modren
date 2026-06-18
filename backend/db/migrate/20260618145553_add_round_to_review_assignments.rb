class AddRoundToReviewAssignments < ActiveRecord::Migration[7.1]
  def change
    add_column :review_assignments, :round, :integer, default: 1
  end
end
