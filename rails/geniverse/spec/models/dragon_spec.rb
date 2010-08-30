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
