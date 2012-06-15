class AddIntroImageUrlToCase < ActiveRecord::Migration
  def up
    add_column :cases, :introImageUrl, :string
  end

  def down
    remove_column :cases, :introImageUrl
  end
end
