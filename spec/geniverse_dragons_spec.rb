dir = File.expand_path(File.dirname(__FILE__))
require "#{dir}/support/spec_helper.rb"

describe "Geniverse Dragons Test" do
  

  before(:all) do
    start_testing_servers
    @app = new_test {|app|
      app['isLoaded'] == true

      app.move_to 1, 1 
      app.resize_to 1024, 768

      app.define_path 'appContainer', 'mainChatExamplePage.mainPane.appContainer', View
      app.define_path 'topBar', 'mainChatExamplePage.mainPane.topBar', View
      app.define_path 'mainAppView', 'mainChatExamplePage.mainPane.appContainer.mainAppView', View
      app.define_path 'yourArticle', 'mainChatExamplePage.yourArticleView', 'Geniverse.ArticleView'
      # app.define_path 'breedView', 'mainChatExamplePage.mainPane.appContainer.mainAppView.breedView', 'Geniverse.BreedDragonView'
    }
    
    @login_field = @app['appContainer.loginView.nameField', 'SC.TextFieldView']
    @password_field = @app['appContainer.loginView.passwordField', 'SC.TextFieldView']
    @login_button = @app['appContainer.loginView.loginButtonView', 'SC.ButtonView']
    @logout_button = @app['topBar.logoutButton', 'SC.ButtonView']
    @welcome_label = @app['topBar.welcomeLabelView', 'SC.LabelView']
    
    @challenge_pool_view = @app['mainAppView.challengePoolView', 'CC.AutoScrollView']
    @breed_view = @app['mainAppView.breedView', 'Geniverse.BreedDragonView']
    @mother_view = @app['mainAppView.breedView.motherView', 'Geniverse.OrganismView']
    @father_view = @app['mainAppView.breedView.fatherView', 'Geniverse.OrganismView']
    @breed_button = @app['mainAppView.breedView.breedButtonView', 'SC.ButtonView']
    @breeding_pen_view = @app['mainAppView.breedingPenView', 'CC.AutoScrollView']
    @chromosome_tool_button = @app['mainAppView.breedingChromosomeToolView', 'SC.ButtonView']
    @stable_view = @app['mainAppView.stableView', 'CC.AutoScrollView']
    
    @chromosome_tool_controller = @app['chromosomeToolController', 'SC.ObjectController']
  end
  
  after(:all) do
    stop_testing_servers
  end
  
  it "login" do
    @login_field.type "Test"
    @password_field.type "Test"
    @login_button.click
  end
  
  it "should have challenge pool with 2 dragons" do
    sleep 3

    @challenge_pool_view.child_views[0].child_views[0].child_views.count.should be 2
  end
  
  it "should be able to drag mother and father from challenge pool to breed view" do
    
    puts "challenge pool: #{@challenge_pool_view}"
    puts "child 1: #{@challenge_pool_view.child_views[0]}"
    puts "child 2: #{@challenge_pool_view.child_views[0].child_views[0]}"
    
    dragon1view = @challenge_pool_view.child_views[0].child_views[0].child_views[0]
    dragon2view = @challenge_pool_view.child_views[0].child_views[0].child_views[1]
    d1sex = dragon1view.organism['sex']
    if (d1sex == 0)
      dragon1view.drag_to @father_view, 20, 20
      dragon2view.drag_to @mother_view, 20, 20
    else
      dragon2view.drag_to @father_view, 20, 20
      dragon1view.drag_to @mother_view, 20, 20
    end

    @breed_view.mother.should_not be nil
    @breed_view.father.should_not be nil
  end
  
  it "should be able to breed 20 dragons" do
    
    @breed_button.click
    sleep 3
    dragon1 = @breeding_pen_view.child_views[0].child_views[0].child_views.count.should be 20
  end
  
  it "should replace the 20 dragons when breeding again" do
    @breed_button.click
    sleep 3
    dragon1 = @breeding_pen_view.child_views[0].child_views[0].child_views.count.should be 20
  end
  
  it "should be able to view genome of one of the bred dragons" do
    @breed_button.click
    sleep 3
    dragon3 = @breeding_pen_view.child_views[0].child_views[0].child_views[2]
    dragon3.click
    
    @chromosome_tool_button.click
    
    # TODO verify that the correct dragon was shown...
    # dragon3.organism.should be @chromosome_tool_controller.dragon
    
    @chromosome_tool_controller.pane.contentView.hideButton.click
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