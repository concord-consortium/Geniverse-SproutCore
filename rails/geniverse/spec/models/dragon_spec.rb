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

  it "should be searchable with known params" do
    Dragon.create!(@valid_attributes.merge({:isInMarketplace => false}))
    second_attributes = @valid_attributes.merge(:user_id => 2, :isInMarketplace => true)
    Dragon.create!(second_attributes)
    third_attributes = @valid_attributes.merge(:user_id => 3, :isInMarketplace => true, :activity_id => 2)
    Dragon.create!(third_attributes)

    params = {:user_id => 1}
    Dragon.search(params).size.should be 1
    params = {:user_id => 2}
    Dragon.search(params).size.should be 1
    params = {:isInMarketplace => true}
    Dragon.search(params).size.should be 2
    params = {:isInMarketplace => true, :user_id => 1}
    Dragon.search(params).size.should be 0
    params = {:activity_id => 2}
    Dragon.search(params).size.should be 1
    params = {:activity_id => 4}
    Dragon.search(params).size.should be 0

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

