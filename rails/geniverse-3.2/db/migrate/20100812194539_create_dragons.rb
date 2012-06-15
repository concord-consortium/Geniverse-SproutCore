class CreateDragons < ActiveRecord::Migration
  def change
    create_table :dragons do |t|
      t.string :gOrganism
      t.string :name
      t.integer :sex
      t.string :alleles
      t.string :imageURL
      t.string :characteristics
      t.string :metaInfo
      t.integer :mother_id
      t.integer :father_id
      t.boolean :bred

      t.timestamps
    end
  end
end
