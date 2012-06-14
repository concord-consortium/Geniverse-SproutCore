class AddMessageToActivities < ActiveRecord::Migration
  def up
    add_column :activities, :message, :text
  end

  def down
    remove_column :activities, :message
  end
end
