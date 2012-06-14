class AddIsMatchDragonToDragons < ActiveRecord::Migration
  def up
    add_column :dragons, :isMatchDragon, :boolean, :default => false
  end

  def down
    remove_column :dragons, :isMatchDragon
  end
end
