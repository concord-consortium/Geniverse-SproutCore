class AddShowColorLabelsToActivity < ActiveRecord::Migration
  def self.up
    add_column :activities, :show_color_labels, :boolean
  end

  def self.down
    remove_column :activities, :show_color_labels
  end
end
