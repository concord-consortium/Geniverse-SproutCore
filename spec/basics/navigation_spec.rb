dir = File.expand_path(File.dirname(__FILE__))
require "#{dir}/../support/spec_helper.rb"

describe "Navigation" do
  describe "Simple forward and back" do

    before(:all) do
      start_testing_servers
      @app = new_test({:app_root_path => "/lab#case01/activity01"}) {|app|
        app['isLoaded'] == true

        app.move_to 1, 1 
        app.resize_to 1024, 768

        define_common_paths(app)
        app.define_path 'mainPane', "chromosomeTrainingSinglePage.mainPane"
        app.define_path 'mainPage', "chromosomeTrainingSinglePage.mainPane.mainAppView"
      }

      define_common_ivars
      
      @back_button_disabled = @app['mainPane.bottomBar.navBarLeftArrowBW', 'SC.ImageView']
      @forward_button_disabled = @app['mainPane.bottomBar.navBarRightArrowBW', 'SC.ImageView']
      
      @back_button = @app['mainPane.bottomBar.navBarLeftArrow', 'SC.ImageView']
      @forward_button = @app['mainPane.bottomBar.navBarRightArrow', 'SC.ImageView']
      
      @forward_button_blocked = @app['mainPane.bottomBar.navBarRightArrowRed', 'SC.ImageView']
      
      @pageTitle = @app['mainPane.topBar.geniverseLabelView', 'SC.LabelView']
    end

    after(:all) do
      stop_testing_servers
    end

    it "should show back disabled and forward enabled" do
      sleep 3

      @back_button_disabled.isVisibleInWindow.should be_true
      # NB: desabled buttons always remain on screen, but may be hidden under other button
      # @forward_button_disabled.isVisibleInWindow.should be_false
      
      @back_button.isVisibleInWindow.should be_false
      @forward_button.isVisibleInWindow.should be_true
      
      @forward_button_blocked.isVisibleInWindow.should be_false
    end
    
    it "should show be able to click forward and go to new activity" do
      @pageTitle.value.should eql "Case 1: Challenge 1"
      @forward_button.click
      @pageTitle.value.should eql "Case 1: Challenge 2"
    end
    
    it "should show forward disabled and back enabled" do
      
      @forward_button_disabled.isVisibleInWindow.should be_true
      
      @back_button.isVisibleInWindow.should be_true
      @forward_button.isVisibleInWindow.should be_false
      
      @forward_button_blocked.isVisibleInWindow.should be_false
    end
    
    it "should show be able to click back and go back to old activity" do
      @pageTitle.value.should eql "Case 1: Challenge 2"
      sleep 3
      @back_button.click
      sleep 3
      @pageTitle.value.should eql "Case 1: Challenge 1"
    end

  end
end
