dir = File.expand_path(File.dirname(__FILE__))
require "#{dir}/../support/spec_helper.rb"

describe "Intro Screen" do
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

    @back_button = @app['mainPane.bottomBar.navBarLeftArrow', 'SC.ImageView']
    @forward_button = @app['mainPane.bottomBar.navBarRightArrow', 'SC.ImageView']

    @pageTitle = @app['mainPane.topBar.geniverseLabelView', 'SC.LabelView']

    @infoController = @app['infoController']

    sleep 3
    @introScreenView = @app['#introScreenView', 'Geniverse.IntroScreenView']
  end

  after(:all) do
    stop_testing_servers
  end

  it "should show the intro screen" do
    @introScreenView.should_not be_nil, "Intro screen should exist"
    @introScreenView.isVisibleInWindow.should be_true, "Intro screen should be visible in window"
  end

  it 'should not be showing the info pane' do
    if @infoController.pane
      @infoController.pane.isVisibleInWindow.should be_false, "Info pane should not be visible in window"
    end
  end

  it 'should dismiss the intro screen when the continue button is clicked' do
    @introScreenView.contentView.hideButton.click
    sleep 1
    @introScreenView.isVisibleInWindow.should be_false, "Intro screen should not be visible in window"
  end

  it 'should show the info pane after the intro screen is dismissed' do
    @infoController.pane.isVisibleInWindow.should be_true, "Info pane should be visible in window"
  end

  it "should show be able to click forward and go to new activity" do
    @pageTitle.value.should eql "Case 1: Challenge 1"
    @forward_button.click
    @pageTitle.value.should eql "Case 1: Challenge 2"
  end

  it 'should not show the intro screen after navigating to the second page' do
    @introScreenView = @app['#introScreenView', 'Geniverse.IntroScreenView']
    @introScreenView.isVisibleInWindow.should be_false, "Intro screen should not be visible in window"
  end

  it "should be able to click back and go back to old activity" do
    @pageTitle.value.should eql "Case 1: Challenge 2"
    @back_button.click
    @pageTitle.value.should eql "Case 1: Challenge 1"
  end

  it 'should show the intro screen after navigating back to the first page' do
    @introScreenView = @app['#introScreenView', 'Geniverse.IntroScreenView']
    @introScreenView.isVisibleInWindow.should be_true, "Intro screen should be visible in window"
    @infoController.pane.isVisibleInWindow.should be_false, "Info pane should not be visible in window"
  end
end
