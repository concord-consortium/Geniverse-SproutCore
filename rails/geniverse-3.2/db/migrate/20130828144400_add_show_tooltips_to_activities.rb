class AddShowTooltipsToActivities < ActiveRecord::Migration
  def change
    add_column :activities, :show_tooltips, :boolean, :default => false
  end
end
