dir = File.expand_path(File.dirname(__FILE__))
require "#{dir}/support/spec_helper.rb"

describe "Login Test" do
  before(:all) do
    start_testing_servers
    @app = new_test {|app|
      app['isLoaded'] == true

      app.move_to 1, 1 
      app.resize_to 1024, 768

      app.define_path 'labPage', 'mainPage.mainPane.mainAppView', View
      app.define_path 'loginPage', 'loginController.panel.contentView', View
      app.define_path 'topBar', 'mainPage.mainPane.topBar', View
    }
    
    @welcome_label = @app['topBar.welcomeLabelView', 'SC.LabelView']
    @logout_button = @app['topBar.logoutButton', 'SC.ButtonView']
    
    @login_field = @app['loginPage.usernameView', 'SC.TextFieldView']
    @password_field = @app['loginPage.passwordView', 'SC.TextFieldView']
    @login_button = @app['loginPage.loginButtonView', 'SC.ButtonView']
  end
  
  after(:all) do
    stop_testing_servers
  end
  
  it "will show the welcome message after login" do
    initial_message = "please log in"
    @welcome_label.value.should eql initial_message

    @login_field.type "student"
    @password_field.type "password"
    @login_button.click
    
    if (@welcome_label.value == initial_message)
      waittime = 11 #seconds
      p "Waiting up to " + waittime.to_s + " seconds for @welcome_label.value to be set."
      start = Time.now
      until @welcome_label.value != initial_message do
        sleep 1
        p " @welcome_label.value: " + @welcome_label.value.to_s
        elapsed = Time.now - start
        p " " + elapsed.to_s + " seconds have passed."
        break if (elapsed >= waittime)
      end
    end
    p "@welcome_label.value is now: " + @welcome_label.value.to_s
    @welcome_label.value.should match /^Welcome Jackie*/
    @welcome_label.isVisibleInWindow.should be_true
  end
  
  it "will show the login field after logout" do
    @login_field.isVisibleInWindow.should_not be_true
    @logout_button.isVisibleInWindow.should be_true
    @logout_button.click
    
    # This exists in gem version of Lebowski at least since 11/22/10
    @app.reset_application_context 

    @login_field.isVisibleInWindow.should be_true
    @logout_button.isVisibleInWindow.should_not be_true
  end
  
end