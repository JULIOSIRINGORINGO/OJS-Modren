class AddRoundToArticles < ActiveRecord::Migration[7.1]
  def change
    add_column :articles, :round, :integer, default: 1
  end
end
