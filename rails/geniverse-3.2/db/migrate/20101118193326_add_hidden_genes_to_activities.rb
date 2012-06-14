class AddHiddenGenesToActivities < ActiveRecord::Migration
  def up
    add_column :activities, :hidden_genes, :string
  end

  def down
    remove_column :activities, :hidden_genes
  end
end
