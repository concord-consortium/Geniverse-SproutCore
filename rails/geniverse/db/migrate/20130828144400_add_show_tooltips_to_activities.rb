class AddShowTooltipsToActivities < ActiveRecord::Migration
  def self.up
    add_column :activities, :show_tooltips, :boolean, :default => false
  end

  def self.down
    remove_column :activities, :show_tooltips
  end
end
