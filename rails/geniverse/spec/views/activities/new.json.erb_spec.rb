require 'spec_helper'

describe "/activities/new.json.erb" do
  include ActivitiesHelper

  before(:each) do
    assigns[:activity] = stub_model(
      Activity,
      :new_record? => true,
      :title => "value for title",
      :initial_alleles => "value for initial_alleles",
      :base_channel_name => "value for base_channel_name",
      :max_users_in_room => 1,
      :send_bred_dragons => false,
      :sc_type => "value for sc_type"
    )
  end

  it "renders new activity in JSON format that SproutCore client app expects" do
    render

    # p "response.body:"
    # p response.body
    # p ""
    response.body.should match("\"content\":")
    response.body.should match("\"status\":\"created\"")
    response.body.should match("\"location\":")
    response.body.should match("\"title\":\"value for title\"")
    response.body.should match("\"initialAlleles\":\"value for initial_alleles\"")
    response.body.should match("\"baseChannelName\":\"value for base_channel_name\"")
    response.body.should match("\"maxUsersInRoom\":" + 1.to_s)
    response.body.should match("\"sendBredDragons\":" + false.to_s)
    response.body.should match("\"scType\":\"value for sc_type\"")
  end
end
