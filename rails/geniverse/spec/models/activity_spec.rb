require 'spec_helper'

describe Activity do
  before(:each) do
    @valid_attributes = {
      :title => "value for title",
      :initial_alleles => "value for initial_alleles",
      :base_channel_name => "value for base_channel_name",
      :max_users_in_room => 1,
      :send_bred_dragons => false,
      :sc_type => "value for sc_type"
    }
  end

  it "should create a new instance given valid attributes" do
    Activity.create!(@valid_attributes)
  end
end

# == Schema Information
#
# Table name: activities
#
#  id                :integer         not null, primary key
#  initial_alleles   :string(255)
#  base_channel_name :string(255)
#  max_users_in_room :integer
#  send_bred_dragons :boolean
#  created_at        :datetime
#  updated_at        :datetime
#  title             :string(255)
#  sc_type           :string(255)
#

