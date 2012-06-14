class ChangeUserNamesToString < ActiveRecord::Migration
  def up
    change_table :users do |t|
      t.change :first_name, :string
      t.change :last_name, :string
    end
  end

  def down
    change_table :users do |t|
      t.change :first_name, :integer
      t.change :last_name, :integer
    end
  end
end
