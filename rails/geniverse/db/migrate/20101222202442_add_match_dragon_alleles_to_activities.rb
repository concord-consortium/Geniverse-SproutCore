class AddMatchDragonAllelesToActivities < ActiveRecord::Migration
  def self.up
    add_column :activities, :match_dragon_alleles, :string
  end

  def self.down
    remove_column :activities, :match_dragon_alleles
  end
end
