class RemoveAttributesFromDragons < ActiveRecord::Migration
  def up
    remove_column :dragons, :gOrganism
    remove_column :dragons, :characteristics
    remove_column :dragons, :metaInfo
  end

  def down
    add_column :dragons, :gOrganism, :string
    add_column :dragons, :characteristics, :string
    add_column :dragons, :metaInfo, :string
  end
end
