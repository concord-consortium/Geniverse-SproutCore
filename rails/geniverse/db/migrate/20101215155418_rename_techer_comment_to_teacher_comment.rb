class RenameTecherCommentToTeacherComment < ActiveRecord::Migration
  def self.up
    change_table :articles do |t|
      t.rename :teacher_comment, :teacherComment
    end
  end

  def self.down
    change_table :articles do |t|
      t.rename :teacherComment, :teacher_comment
    end
  end
end

