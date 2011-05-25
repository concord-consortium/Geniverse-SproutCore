require 'spec_helper'

describe "/activities/index.json.erb" do
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
    assigns[:activities] = [
      stub_model(Activity, @activity_hash),
      stub_model(Activity, @activity_hash)
    ]
  end

  it "renders a list of activities in JSON format as SproutCore client expects it" do
    render
    response.body.should match('"content":')
    @activity_hash.each do |k,v|
      k_str = k.to_s.camelcase.sub(/^[A-Z]/) {|l| l.downcase }
      expected = %!"#{k_str}":!
      if v.kind_of?(Fixnum) || v.kind_of?(FalseClass) || v.kind_of?(TrueClass)
        expected << v.to_s
      else
        expected << %!"#{v.to_s}"!
      end
      response.body.should match(expected)
    end
  end
end
