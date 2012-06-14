class AddClassNameToUsers < ActiveRecord::Migration
  def up
    add_column :users, :class_name, :string
  end

  def down
    remove_column :users, :class_name
  end
end
