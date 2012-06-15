class AddIsArgumentationChallengeToActivities < ActiveRecord::Migration
  def up
    add_column :activities, :is_argumentation_challenge, :boolean, :default => false
  end

  def down
    remove_column :activities, :is_argumentation_challenge
  end
end
