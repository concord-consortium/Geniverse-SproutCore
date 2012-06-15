class AddMatchDragonAllelesToActivities < ActiveRecord::Migration
  def up
    add_column :activities, :match_dragon_alleles, :string
  end

  def down
    remove_column :activities, :match_dragon_alleles
  end
end
