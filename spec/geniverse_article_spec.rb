dir = File.expand_path(File.dirname(__FILE__))
require "#{dir}/support/spec_helper.rb"

describe "Geniverse Article Test" do
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
      app.define_path 'breedView', 'mainChatExamplePage.mainPane.appContainer.mainAppView.breedView', 'Geniverse.BreedDragonView'
    }
    
    @login_field = @app['appContainer.loginView.nameField', 'SC.TextFieldView']
    @password_field = @app['appContainer.loginView.passwordField', 'SC.TextFieldView']
    @login_button = @app['appContainer.loginView.loginButtonView', 'SC.ButtonView']
    @logout_button = @app['topBar.logoutButton', 'SC.ButtonView']
    @welcome_label = @app['topBar.welcomeLabelView', 'SC.LabelView']
    
    @article_text = @app['yourArticle.staticView.textView.contentView', 'SC.LabelView']
    @new_paper_button = @app['yourArticle.staticView.newButtonView', 'SC.ButtonView']
    @edit_paper_button = @app['yourArticle.staticView.editButtonView', 'SC.ButtonView']
    @claim_text_field = @app['yourArticle.editingView.inputClaimView', 'SC.TextFieldView']
    @dragon_bin = @app['yourArticle.editingView.dragonBinView', 'Geniverse.DragonBinView']
    @add_dragons_label = @app['yourArticle.editingView.dragonBinView.addDragonsLabel', 'SC.LabelView']
    @static_dragon_bin = @app['yourArticle.staticView.dragonBinView', 'Geniverse.DragonBinView']
    @preview_paper = @app['yourArticle.editingView.previewButtonView', 'SC.ButtonView']
    @clear_dragons = @app['yourArticle.editingView.clearDragonsButton', 'SC.ButtonView']
    @edit_paper = @app['yourArticle.editingView.clearDragonsButton', 'SC.ButtonView']
    
    @breed_button = @app['breedView.breedButtonView', 'SC.ButtonView']
    @breeding_pen_view = @app['mainAppView.breedingPenView', 'CC.AutoScrollView']
    @stable_view = @app['mainChatExamplePage.bredDragonsScrollView', 'CC.AutoScrollView']
  end
  
  after(:all) do
    stop_testing_servers
  end
  
  it "login" do
    @login_field.type "Test"
    @password_field.type "Test"
    @login_button.click
  end
  
  it "should see initial article text immediately" do
    @article_text.should be_visible_in_window
    @article_text.should have_value "<div id='article'><div class='claim'><i>Write your thoughts here.</i></div></div>"
    @app['yourArticle.editingView'].should_not be_visible_in_window
  end
  
  it "should see editing view when New Paper is clicked" do
    @new_paper_button.should be_visible_in_window
    @new_paper_button.should be_enabled
    @edit_paper_button.should_not be_enabled
    
    @new_paper_button.click
    
    @article_text.should_not be_visible_in_window
    @app['yourArticle.editingView'].should be_visible_in_window
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
    @app['yourArticle.editingView'].should be_visible_in_window
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