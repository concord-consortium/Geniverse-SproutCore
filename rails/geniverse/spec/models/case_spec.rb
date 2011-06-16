require 'spec_helper'

describe Case do
  before(:each) do
    @valid_attributes = {
      :name => "value for name",
      :order => 1
    }
  end

  it "should create a new instance given valid attributes" do
    Case.create!(@valid_attributes)
  end
end
