class AddClassNameToUsers < ActiveRecord::Migration
  def self.up
    add_column :users, :class_name, :string
  end

  def self.down
    remove_column :users, :class_name
  end
end
