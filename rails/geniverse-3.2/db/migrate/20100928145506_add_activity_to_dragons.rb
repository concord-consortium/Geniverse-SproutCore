class AddActivityToDragons < ActiveRecord::Migration
  def up
    add_column :dragons, :activity_id, :integer
  end

  def down
    remove_column :dragons, :activity_id
  end
end
