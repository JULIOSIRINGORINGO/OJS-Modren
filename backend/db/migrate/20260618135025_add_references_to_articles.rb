class AddReferencesToArticles < ActiveRecord::Migration[7.1]
  def change
    add_column :articles, :references, :text
  end
end
