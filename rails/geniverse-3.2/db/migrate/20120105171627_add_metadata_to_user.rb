class AddMetadataToUser < ActiveRecord::Migration
  def up
    add_column :users, :metadata, :text, :limit => 2**21  # about 2 MB limit on metadata
  end

  def down
    remove_column :users, :metadata
  end
end
