class CreateIssues < ActiveRecord::Migration[7.1]
  def change
    create_table :issues do |t|
      t.string :volume
      t.string :number
      t.integer :year
      t.string :title
      t.text :description
      t.string :status, default: 'draft'
      t.datetime :published_at

      t.timestamps
    end
  end
end
