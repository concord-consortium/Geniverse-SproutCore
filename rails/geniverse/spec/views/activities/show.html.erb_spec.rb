require 'spec_helper'

describe "/activities/show.html.erb" do
  include ActivitiesHelper
  before(:each) do
    assigns[:activity] = @activity = stub_model(Activity,
      :title => "value for title",
      :initial_alleles => "value for initial_alleles",
      :base_channel_name => "value for base_channel_name",
      :max_users_in_room => 1,
      :send_bred_dragons => false,
      :sc_type => "value for sc_type"
    )
  end

  it "renders attributes in <p>" do
    render
    response.should have_text(/value\ for\ title/)
    response.should have_text(/value\ for\ initial_alleles/)
    response.should have_text(/value\ for\ base_channel_name/)
    response.should have_text(/1/)
    response.should have_text(/false/)
    response.should have_text(/value\ for\ sc_type/)
  end
end
