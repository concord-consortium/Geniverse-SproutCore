class AddIsMatchDragonToDragons < ActiveRecord::Migration
  def self.up
    add_column :dragons, :isMatchDragon, :boolean, :default => false
  end

  def self.down
    remove_column :dragons, :isMatchDragon
  end
end
