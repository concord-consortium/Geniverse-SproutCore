require 'spec_helper'

describe HelpMessage do
  before(:each) do
    @valid_attributes = {
      :page_name => "value for page_name",
      :message => "value for message"
    }
  end

  it "should create a new instance given valid attributes" do
    HelpMessage.create!(@valid_attributes)
  end
end

# == Schema Information
#
# Table name: help_messages
#
#  id         :integer         not null, primary key
#  page_name  :string(255)
#  message    :text
#  created_at :datetime
#  updated_at :datetime
#

