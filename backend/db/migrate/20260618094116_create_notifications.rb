class CreateNotifications < ActiveRecord::Migration[7.1]
  def change
    create_table :notifications do |t|
      t.references :user, null: false, foreign_key: true
      t.string :kind, null: false, default: 'info'
      t.string :title, null: false
      t.text :body
      t.boolean :read, null: false, default: false
      t.string :link
      t.jsonb :metadata, default: {}

      t.timestamps
    end

    add_index :notifications, [:user_id, :read]
  end
end
