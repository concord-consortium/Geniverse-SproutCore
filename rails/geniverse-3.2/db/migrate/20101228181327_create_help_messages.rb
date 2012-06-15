class CreateHelpMessages < ActiveRecord::Migration
  def up
    create_table :help_messages do |t|
      t.string :page_name
      t.text :message

      t.timestamps
    end
  end

  def down
    drop_table :help_messages
  end
end
