class AddOpenAutomaticallyToUnlockables < ActiveRecord::Migration
  def change
    add_column :unlockables, :open_automatically, :boolean, :default => false
  end
end
