# ==========================================================================
# Project:   Lebowski Framework - The SproutCore Test Automation Framework
# License:   Licensed under MIT license (see License.txt)
# ==========================================================================

# require '../../../lib/lebowski/spec'
# 
# include Lebowski::Foundation
# include Lebowski::Foundation::Views

# you can uncomment this to drive a remote client on saucelabs
# client = Selenium::Client::Driver.new \
#         :host => 'saucelabs.com',
#         :port => 4444, 
#         :browser => '{"username": "scytacki",' +
#           # put a valid access-key in here:
#                       '"access-key": "",' +
#                       '"os": "Windows 2003",' +
#                       '"browser": "safari",' +
#                       '"browser-version": "4.",' +
#                       '"job-name": "Lebowski Test",' +
#                       '"max-duration": 60,' +
#                       '"user-extensions-url": "http://www.concord.org/~sfentress/lebowski/user-extensions.js"}',
#         :url => "http://geniverse.dev.concord.org/sproutcore/", 
#         :timeout_in_seconds => 90

# or you can use this to use your own browser
client = Selenium::Client::Driver.new \
        :host => 'localhost',
        :port => 4444, 
        :browser => :firefox,
        :url => "http://sc.local", 
        :timeout_in_seconds => 90
        
        

App = MainApplication.new \
        :app_root_path => "/geniverse", 
        :app_name => "Geniverse",
        :driver => client


App.start do |app|
  app['isLoaded'] == true
end


App.move_to 1, 1 
App.resize_to 1024, 768


App.define_path 'appContainer', 'mainChatExamplePage.mainPane.appContainer', View
App.define_path 'topBar', 'mainChatExamplePage.mainPane.topBar', View
App.define_path 'mainAppView', 'mainChatExamplePage.mainPane.appContainer.mainAppView', View
App.define_path 'yourArticle', 'mainChatExamplePage.yourArticleView', 'Geniverse.ArticleView'
App.define_path 'breedView', 'mainChatExamplePage.mainPane.appContainer.mainAppView.breedView', 'Geniverse.BreedDragonView'


describe "App Controller Test" do
  

  before(:all) do    
    @login_field = App['appContainer.loginView.nameField', 'SC.TextFieldView']
    @password_field = App['appContainer.loginView.passwordField', 'SC.TextFieldView']
    @login_button = App['appContainer.loginView.loginButtonView', 'SC.ButtonView']
    @logout_button = App['topBar.logoutButton', 'SC.ButtonView']
    @welcome_label = App['topBar.welcomeLabelView', 'SC.LabelView']
    
    @article_text = App['yourArticle.staticView.textView.contentView', 'SC.LabelView']
    @new_paper_button = App['yourArticle.staticView.newButtonView', 'SC.ButtonView']
    @claim_text_field = App['yourArticle.editingView.inputClaimView', 'SC.TextFieldView']
    @dragon_bin = App['yourArticle.editingView.dragonBinView', 'Geniverse.DragonBinView']
    
    @breed_button = App['breedView.breedButtonView', 'SC.ButtonView']
    @breeding_pen_view = App['mainAppView.breedingPenView', 'CC.AutoScrollView']
    @stable_view = App['mainChatExamplePage.bredDragonsScrollView', 'CC.AutoScrollView']
  end
  
  after(:all) do
    App.end
  end
  
  it "login" do
    @login_field.type_append "Test"
    @password_field.type_append "Test"
    @login_button.click
  end
  
  it "should see initial article text immediately" do
    @article_text.should be_visible_in_window
    @article_text.should have_value "<div id='article'><div class='claim'><i>Write your thoughts here.</i></div></div>"
    App['yourArticle.editingView'].should_not be_visible_in_window
  end
  
  it "should see editing view when New Paper is clicked" do
    @new_paper_button.click
    @article_text.should_not be_visible_in_window
    App['yourArticle.editingView'].should be_visible_in_window
    @claim_text_field.should have_value "<i>Write your thoughts here.</i>"
  end
  
  # This test, when it works, should go in a dedicated breeding/stable spec test
 #  it "should be able to breed dragons and drag them to the stable" do
 #    @breed_button.click
 #    @dragon1 = @breeding_pen_view.child_views[0].child_views[0].child_views[0]
 # #   @dragon1.drag_to @stable_view
 #    @dragon1.drag 0, -100
 #    @stable_view.child_views[0].child_views[0].should be @dragon1
 #  end
  
  # this test doesn't work yet
  it "should be able to breed dragons and drag them to dragon bin" do
    @breed_button.click
    @dragon1 = @breeding_pen_view.child_views[0].child_views[0].child_views[0]
    @dragon1.drag_to @dragon_bin
    @dragon_bin.child_views[1].should be @dragon1
  end
  
  
  
  it "will show the login field after logout" do
    @logout_button.click
  end
  
end