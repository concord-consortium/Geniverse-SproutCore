require 'spec_helper'

describe "/activities/index.html.erb" do
  include ActivitiesHelper

  before(:each) do
    assigns[:activities] = [
      stub_model(Activity,
        :title => "value for title",
        :initial_alleles => "value for initial_alleles",
        :base_channel_name => "value for base_channel_name",
        :max_users_in_room => 1,
        :send_bred_dragons => false,
        :sc_type => "value for sc_type"
      ),
      stub_model(Activity,
        :title => "value for title",
        :initial_alleles => "value for initial_alleles",
        :base_channel_name => "value for base_channel_name",
        :max_users_in_room => 1,
        :send_bred_dragons => false,
        :sc_type => "value for sc_type"
      )
    ]
  end

  it "renders a list of activities" do
    render
    response.should have_tag("tr>td", "value for title".to_s, 2)
    response.should have_tag("tr>td", "value for initial_alleles".to_s, 2)
    response.should have_tag("tr>td", "value for base_channel_name".to_s, 2)
    response.should have_tag("tr>td", 1.to_s, 2)
    response.should have_tag("tr>td", false.to_s, 2)
    response.should have_tag("tr>td", "value for sc_type".to_s, 2)
  end
end
