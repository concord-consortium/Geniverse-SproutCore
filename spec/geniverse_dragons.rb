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


describe "Geniverse Dragons Test" do
  

  before(:all) do    
    @login_field = App['appContainer.loginView.nameField', 'SC.TextFieldView']
    @password_field = App['appContainer.loginView.passwordField', 'SC.TextFieldView']
    @login_button = App['appContainer.loginView.loginButtonView', 'SC.ButtonView']
    @logout_button = App['topBar.logoutButton', 'SC.ButtonView']
    @welcome_label = App['topBar.welcomeLabelView', 'SC.LabelView']
    
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
  
  it "should be able to breed 20 dragons" do
    @breed_button.click
    dragon1 = @breeding_pen_view.child_views[0].child_views[0].child_views.count.should be 20
  end
  
  it "should replace the 20 dragons when breeding again" do
    @breed_button.click
    dragon1 = @breeding_pen_view.child_views[0].child_views[0].child_views.count.should be 20
  end
  
  it "should be able to drag dragons from breeding pen to stable" do
    @stable_view.child_views[0].child_views[0].child_views.count.should be 0
    
    dragon1view = @breeding_pen_view.child_views[0].child_views[0].child_views[0]
    alleles = dragon1view.organism['alleles']
    
    dragon1view.drag_to @stable_view, 20, 20
    
    @stable_view.child_views[0].child_views[0].child_views.count.should be 1
    @breeding_pen_view.child_views[0].child_views[0].child_views.count.should be 19
    @stable_view.child_views[0].child_views[0].child_views[0].organism['alleles'].should == alleles
  end
  
  it "should be able to drag dragons to anywhere in stable" do
     dragon2 = @breeding_pen_view.child_views[0].child_views[0].child_views[1]
     dragon3 = @breeding_pen_view.child_views[0].child_views[0].child_views[2]
     
     dragon2.drag_to @stable_view, 100, 100
     dragon3.drag_to @stable_view, 10, 10
     
     @stable_view.child_views[0].child_views[0].child_views.count.should be 3
     @breeding_pen_view.child_views[0].child_views[0].child_views.count.should be 17
   end
   
   it "should always add new dragons to the end" do
     dragon4view = @breeding_pen_view.child_views[0].child_views[0].child_views[1]
     alleles4 = dragon4view.organism['alleles']
     
     dragon4view.drag_to @stable_view, 100, 100
     @stable_view.child_views[0].child_views[0].child_views.count.should be 4
     @stable_view.child_views[0].child_views[0].child_views[3].organism['alleles'].should == alleles4
     
     dragon5view = @breeding_pen_view.child_views[0].child_views[0].child_views[2]
     alleles5 = dragon5view.organism['alleles']
     
     dragon5view.drag_to @stable_view, 5, 5
     @stable_view.child_views[0].child_views[0].child_views.count.should be 5
     @stable_view.child_views[0].child_views[0].child_views[4].organism['alleles'].should == alleles5
   end
 
end