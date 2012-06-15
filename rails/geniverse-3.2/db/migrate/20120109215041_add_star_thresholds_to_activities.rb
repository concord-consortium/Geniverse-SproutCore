class AddStarThresholdsToActivities < ActiveRecord::Migration
  def up
    add_column :activities, :threshold_three_stars, :integer
    add_column :activities, :threshold_two_stars, :integer
  end

  def down
    remove_column :activities, :threshold_two_stars
    remove_column :activities, :threshold_three_stars
  end
end
