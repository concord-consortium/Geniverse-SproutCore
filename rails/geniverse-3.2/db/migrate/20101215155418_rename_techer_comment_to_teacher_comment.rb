class RenameTecherCommentToTeacherComment < ActiveRecord::Migration
  def up
    change_table :articles do |t|
      t.rename :teacher_comment, :teacherComment
    end
  end

  def down
    change_table :articles do |t|
      t.rename :teacherComment, :teacher_comment
    end
  end
end

