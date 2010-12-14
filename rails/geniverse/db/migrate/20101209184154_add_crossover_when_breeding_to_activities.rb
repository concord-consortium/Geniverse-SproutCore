class AddCrossoverWhenBreedingToActivities < ActiveRecord::Migration
  def self.up
    add_column :activities, :crossover_when_breeding, :boolean, :default => false
  end

  def self.down
    remove_column :activities, :crossover_when_breeding
  end
end
