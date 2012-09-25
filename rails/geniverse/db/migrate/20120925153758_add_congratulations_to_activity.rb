class AddCongratulationsToActivity < ActiveRecord::Migration
  def self.up
    add_column :activities, :congratulations, :text
  end

  def self.down
    remove_column :activities, :congratulations
  end
end
