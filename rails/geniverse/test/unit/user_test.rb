require 'test_helper'

class UserTest < ActiveSupport::TestCase
  # Replace this with your real tests.
  test "the truth" do
    assert true
  end
end


# == Schema Information
#
# Table name: users
#
#  id            :integer         not null, primary key
#  username      :string(255)
#  password_hash :string(255)
#  created_at    :datetime
#  updated_at    :datetime
#  group_id      :integer
#  member_id     :integer
#  first_name    :string(255)
#  last_name     :string(255)
#  note          :text
#

