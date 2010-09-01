require 'spec_helper'

describe "/users/new.html.erb" do
  include UsersHelper

  before(:each) do
    assigns[:user] = stub_model(User,
      :new_record? => true,
      :username => "value for username",
      :password_hash => "value for password_hash"
    )
  end

  it "renders new user form" do
    render

    response.should have_tag("form[action=?][method=post]", users_path) do
      with_tag("input#user_username[name=?]", "user[username]")
      with_tag("input#user_password_hash[name=?]", "user[password_hash]")
    end
  end
end
