class AddBredByAndBreedTimeToDragons < ActiveRecord::Migration
  def up
    add_column :dragons, :breeder_id, :integer
    add_column :dragons, :breedTime, :integer
  end

  def down
    remove_column :dragons, :breedTime
    remove_column :dragons, :breeder_id
  end
end
