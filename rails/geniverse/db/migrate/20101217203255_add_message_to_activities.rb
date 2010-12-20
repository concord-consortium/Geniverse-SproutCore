class AddMessageToActivities < ActiveRecord::Migration
  def self.up
    add_column :activities, :message, :text
  end

  def self.down
    remove_column :activities, :message
  end
end
