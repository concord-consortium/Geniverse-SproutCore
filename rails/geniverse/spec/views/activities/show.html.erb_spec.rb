require 'spec_helper'

describe "/activities/show.html.erb" do
  include ActivitiesHelper
  before(:each) do
    @activity_hash = {
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
    assigns[:activity] = @activity = stub_model(Activity,@activity_hash)
  end

  it "renders attributes in <p>" do
    render
    @activity_hash.each do |k,v|
      response.should have_text(Regexp.new(v.to_s))
    end
  end
end
