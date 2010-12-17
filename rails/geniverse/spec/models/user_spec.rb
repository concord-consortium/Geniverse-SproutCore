require 'spec_helper'

describe User do
  before(:each) do
    @valid_attributes = {
      :username => "value for username",
      :password_hash => "value for password_hash"
    }
  end

  it "should create a new instance given valid attributes" do
    User.create!(@valid_attributes)
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

