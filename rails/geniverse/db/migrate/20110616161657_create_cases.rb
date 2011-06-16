class CreateCases < ActiveRecord::Migration
  def self.up
    create_table :cases do |t|
      t.string :name
      t.integer :order

      t.timestamps
    end

    add_column :activities, :myCase_id, :integer
    add_column :activities, :myCaseOrder, :integer
  end

  def self.down
    remove_column :activities, :myCase_id
    remove_column :activities, :myCaseOrder

    drop_table :cases
  end
end
