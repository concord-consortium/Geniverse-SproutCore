class AddIsArgumentationChallengeToActivities < ActiveRecord::Migration
  def self.up
    add_column :activities, :is_argumentation_challenge, :boolean, :default => false
  end

  def self.down
    remove_column :activities, :is_argumentation_challenge
  end
end
