dir = File.expand_path(File.dirname(__FILE__))
require "#{dir}/support/spec_helper.rb"

describe "App Controller Test" do
  before(:all) do
    start_testing_servers
    @app = new_test {|app|
      app['isLoaded'] == true

      app.move_to 1, 1 
      app.resize_to 1024, 768

      app.define_path 'appContainer', 'mainChatExamplePage.mainPane.appContainer', View
      app.define_path 'topBar', 'mainChatExamplePage.mainPane.topBar', View
    }
    
    @login_field = @app['appContainer.loginView.nameField', 'SC.TextFieldView']
    @password_field = @app['appContainer.loginView.passwordField', 'SC.TextFieldView']
    @login_button = @app['appContainer.loginView.loginButtonView', 'SC.ButtonView']
    @welcome_label = @app['topBar.welcomeLabelView', 'SC.LabelView']
    @logout_button = @app['topBar.logoutButton', 'SC.ButtonView']
  end
  
  after(:all) do
    stop_testing_servers
  end
  
  it "will show the welcome message after login" do
    @welcome_label.value.should eql ""
    
    ## FIXME: These don't work on the deployed geniverse application...
    @welcome_label.isVisibleInWindow.should_not be_true
    # @welcome_label.should have_text_align 'right' # check that we can test for arbitrary SC properties
    
    @login_field.type "Test"
    @password_field.type "Test"
    @login_button.click
    
    if (@welcome_label.value == "")
      waittime = 10 #seconds
      p "Waiting up to " + waittime.to_s + " seconds for @welcome_label.value to be set."
      start = Time.now
      until @welcome_label.value != "" do
        p " @welcome_label.value: " + @welcome_label.value.to_s
        elapsed = start -Time.now
        p " " + elapsed.to_s + " seconds have passed."
        break if (elapsed >= waittime)
      end
    end
    p "@welcome_label.value is now: " + @welcome_label.value.to_s
    @welcome_label.value.should match /^Welcome Test*/
    @welcome_label.isVisibleInWindow.should be_true
  end
  
  it "will show the login field after logout" do
    @login_field.isVisibleInWindow.should_not be_true
    @logout_button.isVisibleInWindow.should be_true
    @logout_button.click
    
    ## FIXME: The SproutCore app reloads after logout, so we lose the SC object and can't continue
    ## Apparently there will soon be updates to Lebowski that will allow us to deal with this
    pending 'waiting for lebowski framework updates' do
      @login_field.isVisibleInWindow.should be_true
      @logout_button.isVisibleInWindow.should_not be_true
    end
  end
  
end