class AddUsersToDragons < ActiveRecord::Migration
  def up
    add_column :dragons, :user_id, :integer
  end

  def down
    remove_column :dragons, :user_id
  end
end
