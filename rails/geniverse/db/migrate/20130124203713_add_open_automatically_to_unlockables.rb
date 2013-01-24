class AddOpenAutomaticallyToUnlockables < ActiveRecord::Migration
  def self.up
    add_column :unlockables, :open_automatically, :boolean, :default => false
  end

  def self.down
    remove_column :unlockables, :open_automatically
  end
end
