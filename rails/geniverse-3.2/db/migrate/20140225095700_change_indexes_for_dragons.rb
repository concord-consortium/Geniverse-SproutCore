class ChangeIndexesForDragons < ActiveRecord::Migration
  def up
    remove_index :dragons, :name => 'breed_record_index'
    add_index :dragons, [:breeder_id, :breedTime, :id], :name => :breed_record_index

    add_index :dragons, :mother_id, :name => :mother_index
    add_index :dragons, :father_id, :name => :father_index
  end
  def down
    remove_index :dragons, :name => 'breed_record_index'
    add_index :dragons, [:mother_id, :father_id, :breeder_id, :breedTime, :id], :name => :breed_record_index

    remove_index :dragons, :name => :mother_index
    remove_index :dragons, :name => :father_index
  end
end
