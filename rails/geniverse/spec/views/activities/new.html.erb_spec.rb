require 'spec_helper'

describe "/activities/new.html.erb" do
  include ActivitiesHelper

  before(:each) do
    assigns[:activity] = @activity = stub_model(Activity, {:id => nil})
  end

  it "renders new activity form" do
    render

    response.should have_tag("form[action=?][method=post]", activities_path) do
      %w{ title base_channel_name max_users_in_room send_bred_dragons hidden_genes static_genes crossover_when_breeding route pageType }.each do |att|
        with_tag("input#activity_#{att}[name=?]", "activity[#{att}]")
      end

      %w{ initial_alleles match_dragon_alleles message }.each do |att|
        with_tag("textarea#activity_#{att}[name=?]", "activity[#{att}]")
      end
    end
  end
end
