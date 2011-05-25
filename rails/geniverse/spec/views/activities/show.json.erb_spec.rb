require 'spec_helper'

describe "activities/show.json.erb" do
  # before(:each) do
  #   @activity_pages =  [ActivityPage.create(:name => "page name", :intro_text => "intro_text")]
  #   @activity = Activity.create(:title => "title of activity", :activity_pages => @activity_pages)
  #   assigns[:activity] = @activity
  # end
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
    assigns[:activity] = @activity = stub_model(Activity, @activity_hash)
  end

  it "renders showing JSON of an activity as SproutCore client expects it" do
    render
    response.body.should match("\"content\":")
    response.body.should match("\"guid\":\"/rails/activities/[0-9]*")
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
