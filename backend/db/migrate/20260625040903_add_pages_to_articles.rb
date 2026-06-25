class AddPagesToArticles < ActiveRecord::Migration[7.1]
  def change
    add_column :articles, :pages, :string
  end
end
