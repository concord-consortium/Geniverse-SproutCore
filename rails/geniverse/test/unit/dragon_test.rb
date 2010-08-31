require 'test_helper'

class DragonTest < ActiveSupport::TestCase
  # Replace this with your real tests.
  test "the truth" do
    assert true
  end
end

# == Schema Information
#
# Table name: dragons
#
#  id         :integer         not null, primary key
#  name       :string(255)
#  sex        :integer
#  alleles    :string(255)
#  imageURL   :string(255)
#  mother_id  :integer
#  father_id  :integer
#  bred       :boolean
#  created_at :datetime
#  updated_at :datetime
#  user_id    :integer
#

