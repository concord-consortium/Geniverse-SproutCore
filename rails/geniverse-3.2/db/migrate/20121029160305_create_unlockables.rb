class CreateUnlockables < ActiveRecord::Migration
  def self.up
    create_table :unlockables do |t|
      t.text :content
      t.string :trigger

      t.timestamps
    end
  end

  def self.down
    drop_table :unlockables
  end
end
