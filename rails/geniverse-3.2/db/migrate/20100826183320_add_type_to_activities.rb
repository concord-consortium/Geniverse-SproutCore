class AddTypeToActivities < ActiveRecord::Migration
  def up
    add_column :activities, :sc_type, :string
  end

  def down
    remove_column :activities, :sc_type
  end
end
