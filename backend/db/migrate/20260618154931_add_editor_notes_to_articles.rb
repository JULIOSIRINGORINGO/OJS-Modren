class AddEditorNotesToArticles < ActiveRecord::Migration[7.1]
  def change
    add_column :articles, :editor_notes, :text
  end
end
