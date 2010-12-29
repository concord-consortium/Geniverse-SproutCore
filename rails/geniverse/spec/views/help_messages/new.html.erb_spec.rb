require 'spec_helper'

describe "/help_messages/new.html.erb" do
  include HelpMessagesHelper

  before(:each) do
    assigns[:help_message] = stub_model(HelpMessage,
      :new_record? => true,
      :page_name => "value for page_name",
      :message => "value for message"
    )
  end

  it "renders new help_message form" do
    render

    response.should have_tag("form[action=?][method=post]", help_messages_path) do
      with_tag("input#help_message_page_name[name=?]", "help_message[page_name]")
      with_tag("textarea#help_message_message[name=?]", "help_message[message]")
    end
  end
end
