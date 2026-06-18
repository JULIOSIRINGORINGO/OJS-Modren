class CreateArticles < ActiveRecord::Migration[7.1]
  def change
    create_table :articles do |t|
      t.string :title
      t.text :abstract
      t.string :authors
      t.string :keywords
      t.string :status
      t.string :doi
      t.integer :views, default: 0
      t.integer :downloads, default: 0
      t.string :issue
      t.string :volume
      t.datetime :published_at
      t.datetime :submitted_at
      t.references :category, null: false, foreign_key: true
      t.references :user, null: false, foreign_key: true

      t.timestamps
    end
  end
end
