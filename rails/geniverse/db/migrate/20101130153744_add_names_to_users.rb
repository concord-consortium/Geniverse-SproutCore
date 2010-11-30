class AddNamesToUsers < ActiveRecord::Migration
  def self.up
    add_column :users, :first_name,  :integer
    add_column :users, :last_name, :integer
  end

  def self.down
    remove_column :users, :first_name
    remove_column :users, :last_name
  end
end
