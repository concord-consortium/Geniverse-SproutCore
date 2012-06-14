class CreateCases < ActiveRecord::Migration
  def up
    create_table :cases do |t|
      t.string :name
      t.integer :order

      t.timestamps
    end

    add_column :activities, :myCase_id, :integer
    add_column :activities, :myCaseOrder, :integer
  end

  def down
    remove_column :activities, :myCase_id
    remove_column :activities, :myCaseOrder

    drop_table :cases
  end
end
