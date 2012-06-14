class CreateActivities < ActiveRecord::Migration
  def change
    create_table :activities do |t|
      t.string :initial_alleles
      t.string :base_channel_name
      t.integer :max_users_in_room
      t.boolean :send_bred_dragons

      t.timestamps
    end
  end
end
