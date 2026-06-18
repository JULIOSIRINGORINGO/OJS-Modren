class AddBioAndOrcidToUsers < ActiveRecord::Migration[7.1]
  def change
    add_column :users, :bio, :text
    add_column :users, :orcid, :string
  end
end
