require 'spec_helper'

describe "/users/show.html.erb" do
  include UsersHelper
  before(:each) do
    assigns[:user] = @user = stub_model(User,
      :username => "value for username",
      :password_hash => "value for password_hash"
    )
  end

  it "renders attributes in <p>" do
    render
    response.should have_text(/value\ for\ username/)
    response.should have_text(/value\ for\ password_hash/)
  end
end
