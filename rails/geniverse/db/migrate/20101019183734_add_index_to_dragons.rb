class AddIndexToDragons < ActiveRecord::Migration
  def self.up
    add_index :dragons, :id
    add_index :dragons, :user_id
    add_index :dragons, :activity_id
  end

  def self.down
    remove_index :dragons, :id
    remove_index :dragons, :user_id
    remove_index :dragons, :activity_id
  end
end
