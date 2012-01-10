class AddStarThresholdsToActivities < ActiveRecord::Migration
  def self.up
    add_column :activities, :threshold_three_stars, :integer
    add_column :activities, :threshold_two_stars, :integer
  end

  def self.down
    remove_column :activities, :threshold_two_stars
    remove_column :activities, :threshold_three_stars
  end
end
