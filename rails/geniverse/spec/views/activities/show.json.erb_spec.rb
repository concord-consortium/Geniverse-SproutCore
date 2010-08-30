require 'spec_helper'

describe "activities/show.json.erb" do
  # before(:each) do
  #   @activity_pages =  [ActivityPage.create(:name => "page name", :intro_text => "intro_text")]
  #   @activity = Activity.create(:title => "title of activity", :activity_pages => @activity_pages)
  #   assigns[:activity] = @activity
  # end
  include ActivitiesHelper
  before(:each) do
    assigns[:activity] = @activity = stub_model(
      Activity,
      :title => "Apprentice Heredity Intro",
      :initial_alleles => "[{m: 'a:f,b:f', f: 'a:F,b:F'}, {m: 'a:W,b:W', f: 'a:w,b:w'}]",
      :base_channel_name => "apprenticeHeredityIntro",
      :max_users_in_room => 100,
      :send_bred_dragons => true,
      :sc_type => "Apprentice/Heredity/Intro"
    )
  end

  it "renders showing JSON of an activity as SproutCore client expects it" do

    render
    # p "response.body:"
    # p response.body
    # p ""
    response.body.should match("\"content\":")
    response.body.should match("\"guid\":\"/rails/activities/[0-9]*")
    response.body.should match("\"title\":\"Apprentice Heredity Intro\"")
    response.body.should match("[{m: 'a:f,b:f', f: 'a:F,b:F'}, {m: 'a:W,b:W', f: 'a:w,b:w'}]")
    response.body.should match("\"baseChannelName\":\"apprenticeHeredityIntro\"")
    response.body.should match("\"maxUsersInRoom\":100")
    response.body.should match("\"sendBredDragons\":true")
    response.body.should match("\"scType\":\"Apprentice/Heredity/Intro\"")
  end
end
