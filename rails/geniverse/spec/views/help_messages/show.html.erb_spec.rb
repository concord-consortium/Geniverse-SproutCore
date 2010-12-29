require 'spec_helper'

describe "/help_messages/show.html.erb" do
  include HelpMessagesHelper
  before(:each) do
    assigns[:help_message] = @help_message = stub_model(HelpMessage,
      :page_name => "value for page_name",
      :message => "value for message"
    )
  end

  it "renders attributes in <p>" do
    render
    response.should have_text(/value\ for\ page_name/)
    response.should have_text(/value\ for\ message/)
  end
end
