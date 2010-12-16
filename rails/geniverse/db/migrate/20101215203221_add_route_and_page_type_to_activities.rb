class AddRouteAndPageTypeToActivities < ActiveRecord::Migration
  def self.up
    remove_column :activities, :sc_type
    add_column :activities, :route, :string
    add_column :activities, :pageType, :string
  end

  def self.down
    remove_column :activities, :pageType
    remove_column :activities, :route
    add_column :activities, :sc_type, :string
  end
end
