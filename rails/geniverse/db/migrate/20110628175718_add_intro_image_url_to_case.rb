class AddIntroImageUrlToCase < ActiveRecord::Migration
  def self.up
    add_column :cases, :introImageUrl, :string
  end

  def self.down
    remove_column :cases, :introImageUrl
  end
end
