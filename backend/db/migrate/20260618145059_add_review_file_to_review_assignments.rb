class AddReviewFileToReviewAssignments < ActiveRecord::Migration[7.1]
  def change
    add_column :review_assignments, :review_file, :string
  end
end
