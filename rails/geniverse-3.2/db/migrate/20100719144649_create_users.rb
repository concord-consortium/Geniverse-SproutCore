class CreateUsers < ActiveRecord::Migration
  def up
    create_table :users do |t|
      t.string :username
      t.string :password_hash
      t.timestamps
    end
    
    add_index :users, [:username, :password_hash]
  end

  def down
    remove_index :users, [:username, :password_hash]
    drop_table :users
  end
end
