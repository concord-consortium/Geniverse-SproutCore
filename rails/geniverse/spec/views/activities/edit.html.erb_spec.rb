require 'spec_helper'

describe "/activities/edit.html.erb" do
  include ActivitiesHelper

  before(:each) do
    assigns[:activity] = @activity = stub_model(Activity,{
      :title => "value for title",
      :initial_alleles => "value for initial_alleles",
      :base_channel_name => "value for base_channel_name",
      :max_users_in_room => 1,
      :send_bred_dragons => false,
      :hidden_genes => "value for hidden_genes",
      :static_genes => "value for static_genes",
      :crossover_when_breeding => false,
      :route => "/value/for/route",
      :pageType => "value for pageType",
      :message => "value for message",
      :match_dragon_alleles => "value for match_dragon_alleles"
    }
    )
  end

  it "renders the edit activity form" do
    render

    response.should have_tag("form[action=#{activity_path(@activity)}][method=post]") do
      %w{ title base_channel_name max_users_in_room send_bred_dragons hidden_genes static_genes crossover_when_breeding route pageType }.each do |att|
        with_tag("input#activity_#{att}[name=?]", "activity[#{att}]")
      end

      %w{ initial_alleles match_dragon_alleles message }.each do |att|
        with_tag("textarea#activity_#{att}[name=?]", "activity[#{att}]")
      end
    end
  end
end
