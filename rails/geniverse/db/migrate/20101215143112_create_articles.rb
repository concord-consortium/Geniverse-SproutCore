class CreateArticles < ActiveRecord::Migration
  def self.up
    create_table :articles do |t|
      t.integer :group
      t.integer :activity_id
      t.text :text
      t.integer :time
      t.boolean :submitted
      t.text :teacher_comment
      t.boolean :accepted

      t.timestamps
    end
  end

  def self.down
    drop_table :articles
  end
end
