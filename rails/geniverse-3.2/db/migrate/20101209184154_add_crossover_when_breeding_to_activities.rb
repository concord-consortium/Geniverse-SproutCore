class AddCrossoverWhenBreedingToActivities < ActiveRecord::Migration
  def up
    add_column :activities, :crossover_when_breeding, :boolean, :default => false
  end

  def down
    remove_column :activities, :crossover_when_breeding
  end
end
