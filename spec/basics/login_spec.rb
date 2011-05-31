dir = File.expand_path(File.dirname(__FILE__))
require "#{dir}/support/spec_helper.rb"

describe "Login" do
  before(:all) do
    start_testing_servers
    @app = new_test {|app|
      app['isLoaded'] == true

      app.move_to 1, 1 
      app.resize_to 1024, 768

      define_common_paths(app)
    }
    
    define_common_ivars  
  end
  
  after(:all) do
    stop_testing_servers
  end
  
  it "will show the welcome message after login" do
    initial_message = "please log in"
    @welcome_label.value.should eql ""
    @login_prompt.value.should eql initial_message

    login("student", "password")

    @welcome_label.value.should match /^Welcome Jackie*/
    @welcome_label.isVisibleInWindow.should be_true
  end
  
  it "will show the login field after logout" do
    @login_field.isVisibleInWindow.should_not be_true
    @logout_button.isVisibleInWindow.should be_true

    logout

    @login_field.isVisibleInWindow.should be_true
  end
  
end
