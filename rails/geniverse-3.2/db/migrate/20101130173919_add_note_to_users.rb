class AddNoteToUsers < ActiveRecord::Migration
  def up
    add_column :users, :note,  :text
  end

  def down
    remove_column :users, :note
  end
end
