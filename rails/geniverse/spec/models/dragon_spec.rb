require 'spec_helper'

describe Dragon do
  before(:each) do
    @valid_attributes = {
      :name => "value for name",
      :sex => 1,
      :alleles => "value for alleles",
      :imageURL => "value for imageURL",
      :mother_id => 1,
      :father_id => 1,
      :bred => false,
      :user_id => 1
    }
  end

  it "should create a new instance given valid attributes" do
    Dragon.create!(@valid_attributes)
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

