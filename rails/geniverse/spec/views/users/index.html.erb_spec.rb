require 'spec_helper'

describe "/users/index.html.erb" do
  include UsersHelper

  before(:each) do
    assigns[:users] = [
      stub_model(User,
        :username => "value for username",
        :password_hash => "value for password_hash"
      ),
      stub_model(User,
        :username => "value for username",
        :password_hash => "value for password_hash"
      )
    ]
  end

  it "renders a list of users" do
    render
    response.should have_tag("tr>td", "value for username".to_s, 2)
    response.should have_tag("tr>td", "value for password_hash".to_s, 2)
  end
end
