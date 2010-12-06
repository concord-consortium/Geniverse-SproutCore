class AddStaticGenesToActivities < ActiveRecord::Migration
  def self.up
    add_column :activities, :static_genes,  :text
  end

  def self.down
    remove_column :activities, :static_genes
  end
end
