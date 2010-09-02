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


describe "Geniverse Article Test" do
  

  before(:all) do    
    @login_field = App['appContainer.loginView.nameField', 'SC.TextFieldView']
    @password_field = App['appContainer.loginView.passwordField', 'SC.TextFieldView']
    @login_button = App['appContainer.loginView.loginButtonView', 'SC.ButtonView']
    @logout_button = App['topBar.logoutButton', 'SC.ButtonView']
    @welcome_label = App['topBar.welcomeLabelView', 'SC.LabelView']
    
    @article_text = App['yourArticle.staticView.textView.contentView', 'SC.LabelView']
    @new_paper_button = App['yourArticle.staticView.newButtonView', 'SC.ButtonView']
    @edit_paper_button = App['yourArticle.staticView.editButtonView', 'SC.ButtonView']
    @claim_text_field = App['yourArticle.editingView.inputClaimView', 'SC.TextFieldView']
    @dragon_bin = App['yourArticle.editingView.dragonBinView', 'Geniverse.DragonBinView']
    @add_dragons_label = App['yourArticle.editingView.dragonBinView.addDragonsLabel', 'SC.LabelView']
    @static_dragon_bin = App['yourArticle.staticView.dragonBinView', 'Geniverse.DragonBinView']
    @preview_paper = App['yourArticle.editingView.previewButtonView', 'SC.ButtonView']
    @clear_dragons = App['yourArticle.editingView.clearDragonsButton', 'SC.ButtonView']
    @edit_paper = App['yourArticle.editingView.clearDragonsButton', 'SC.ButtonView']
    
    @breed_button = App['breedView.breedButtonView', 'SC.ButtonView']
    @breeding_pen_view = App['mainAppView.breedingPenView', 'CC.AutoScrollView']
    @stable_view = App['mainChatExamplePage.bredDragonsScrollView', 'CC.AutoScrollView']
  end
  
  after(:all) do
    App.end
  end
  
  it "login" do
    @login_field.type "Test"
    @password_field.type "Test"
    @login_button.click
  end
  
  it "should see initial article text immediately" do
    @article_text.should be_visible_in_window
    @article_text.should have_value "<div id='article'><div class='claim'><i>Write your thoughts here.</i></div></div>"
    App['yourArticle.editingView'].should_not be_visible_in_window
  end
  
  it "should see editing view when New Paper is clicked" do
    @new_paper_button.should be_visible_in_window
    @new_paper_button.should be_enabled
    @edit_paper_button.should_not be_enabled
    
    @new_paper_button.click
    
    @article_text.should_not be_visible_in_window
    App['yourArticle.editingView'].should be_visible_in_window
    @claim_text_field.should have_value "<i>Write your thoughts here.</i>"
  end
  
  it "should be able to breed dragons and drag them to dragon bin" do
    @breed_button.click
    dragon1 = @breeding_pen_view.child_views[0].child_views[0].child_views[0]
    
    @dragon_bin.child_views.count.should be 1
    @add_dragons_label.should be_visible_in_window
    
    dragon1.drag_to @dragon_bin, 20, 20
    
    @dragon_bin.child_views.count.should be 2
    @add_dragons_label.should_not be_visible_in_window
    
    dragon2 = @breeding_pen_view.child_views[0].child_views[0].child_views[2]
    dragon2.drag_to @dragon_bin, 20, 20
    
    @dragon_bin.child_views.count.should be 3
  end
  
  it "should see new dragons in static dragon bin when previewing" do
    @static_dragon_bin.should_not be_visible_in_window
    @preview_paper.click
    
    @static_dragon_bin.should be_visible_in_window
    @static_dragon_bin.child_views.count.should be 3
  end
  
  it "should be able to edit paper again" do
    @edit_paper_button.should be_visible_in_window
    @edit_paper_button.should be_enabled
    @new_paper_button.should_not be_enabled
    
    @edit_paper_button.click
    
    @article_text.should_not be_visible_in_window
    App['yourArticle.editingView'].should be_visible_in_window
    @dragon_bin.child_views.count.should be 3
  end
  
  it "should be able to clear dragons from dragon bin" do
    @clear_dragons.click
    @dragon_bin.child_views.count.should be 1
    @add_dragons_label.should be_visible_in_window
  end
 
  it "will show the login field after logout" do
    @logout_button.click
  end
  
end