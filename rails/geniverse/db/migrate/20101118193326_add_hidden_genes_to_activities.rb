class AddHiddenGenesToActivities < ActiveRecord::Migration
  def self.up
    add_column :activities, :hidden_genes, :string
  end

  def self.down
    remove_column :activities, :hidden_genes
  end
end
