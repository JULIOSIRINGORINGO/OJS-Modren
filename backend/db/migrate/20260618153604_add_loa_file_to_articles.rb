class AddLoaFileToArticles < ActiveRecord::Migration[7.1]
  def change
    add_column :articles, :loa_file, :string
  end
end
