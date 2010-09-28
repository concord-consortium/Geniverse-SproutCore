class AddActivityToDragons < ActiveRecord::Migration
  def self.up
    add_column :dragons, :activity_id, :integer
  end

  def self.down
    remove_column :dragons, :activity_id
  end
end
