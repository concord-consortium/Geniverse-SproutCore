require 'test_helper'

class ArticleTest < ActiveSupport::TestCase
  # Replace this with your real tests.
  test "the truth" do
    assert true
  end
end

# == Schema Information
#
# Table name: articles
#
#  id             :integer         not null, primary key
#  group          :integer
#  activity_id    :integer
#  text           :text
#  time           :integer
#  submitted      :boolean
#  teacherComment :text
#  accepted       :boolean
#  created_at     :datetime
#  updated_at     :datetime
#

