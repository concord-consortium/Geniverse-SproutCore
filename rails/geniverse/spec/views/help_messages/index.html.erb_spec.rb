require 'spec_helper'

describe "/help_messages/index.html.erb" do
  include HelpMessagesHelper

  before(:each) do
    assigns[:help_messages] = [
      stub_model(HelpMessage,
        :page_name => "value for page_name",
        :message => "value for message"
      ),
      stub_model(HelpMessage,
        :page_name => "value for page_name",
        :message => "value for message"
      )
    ]
  end

  it "renders a list of help_messages" do
    render
    response.should have_tag("tr>td", "value for page_name".to_s, 2)
    response.should have_tag("tr>td", "value for message".to_s, 2)
  end
end
