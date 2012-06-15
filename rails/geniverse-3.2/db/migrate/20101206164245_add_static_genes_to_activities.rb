class AddStaticGenesToActivities < ActiveRecord::Migration
  def up
    add_column :activities, :static_genes,  :text
  end

  def down
    remove_column :activities, :static_genes
  end
end
