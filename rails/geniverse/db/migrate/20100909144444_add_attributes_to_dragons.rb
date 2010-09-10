class AddAttributesToDragons < ActiveRecord::Migration
  def self.up
    add_column :dragons, :stableOrder, :integer
    add_column :dragons, :isEgg, :boolean, :default => false
    add_column :dragons, :isInMarketplace, :boolean, :default => true
  end

  def self.down
    remove_column :dragons, :stableOrder
    remove_column :dragons, :isEgg
    remove_column :dragons, :isInMarketplace
  end
end
