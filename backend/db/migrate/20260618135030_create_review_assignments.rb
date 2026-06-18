class CreateReviewAssignments < ActiveRecord::Migration[7.1]
  def change
    create_table :review_assignments do |t|
      t.belongs_to :article, null: false, foreign_key: true
      t.belongs_to :user, null: false, foreign_key: true
      t.string :recommendation
      t.text :comments
      t.string :status, default: 'pending'

      t.timestamps
    end
  end
end
