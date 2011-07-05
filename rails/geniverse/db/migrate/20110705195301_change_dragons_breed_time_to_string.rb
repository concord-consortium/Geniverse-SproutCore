class ChangeDragonsBreedTimeToString < ActiveRecord::Migration
  def self.up
    change_table :dragons do |t|
      t.change :breedTime, :string, :limit => 16
    end
    add_index :dragons, [:mother_id, :father_id, :breeder_id, :breedTime, :id], :name => :breed_record_index
  end

  def self.down
    remove_index :dragons, :name => :breed_record_index
    change_table :dragons do |t|
      t.change :breedTime, :integer
    end
  end
end
