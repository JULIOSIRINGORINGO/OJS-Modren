class AddIssueToArticles < ActiveRecord::Migration[7.1]
  def change
    add_reference :articles, :issue, null: true, foreign_key: true
  end
end
