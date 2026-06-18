class AddFileNameToArticles < ActiveRecord::Migration[7.1]
  def change
    add_column :articles, :file_name, :string
  end
end
