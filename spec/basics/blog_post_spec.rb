dir = File.expand_path(File.dirname(__FILE__))
require "#{dir}/../support/spec_helper.rb"

describe "Blog post" do
  before(:all) do
    start_testing_servers(false)
    @app = new_test {|app|
      app['isLoaded'] == true

      app.move_to 1, 1 
      app.resize_to 1024, 768

      define_common_paths(app)
    }
    
    define_common_ivars(false)
    @blog_button = @app['topBar.blogButton', 'SC.ImageView']
  end
  
  after(:all) do
    stop_testing_servers
  end
  
  it "will not show the editing window when logged out" do
    openBlogPanel
    
    @app['Geniverse.blogPostController.blogPostView'].should be_nil
  end
  
  it "will show the editing window when logged in and the blog button is clicked" do
    login("student", "password")
    openBlogPanel
    # @blog_pane.isVisibleInWindow.should be_true
    @app['Geniverse.blogPostController.blogPostView'].isVisibleInWindow.should be_true
  end
  
  it "will close the editing window when cancel is clicked" do
    @app['Geniverse.blogPostController.blogPostView.contentView'].isVisibleInWindow.should be_true
    @app['Geniverse.blogPostController.blogPostView.contentView.cancelButton'].click
    @app['Geniverse.blogPostController.blogPostView.contentView'].isVisibleInWindow.should be_false
  end
  
  it "will show a confirmation if blog post is created and posted" do
    openBlogPanel
    @app['Geniverse.blogPostController.blogPostView.contentView.blogTitleView'].type "Test post"
    @app['Geniverse.blogPostController.blogPostView.contentView.blogPostView1'].type "Test content"
    @app['Geniverse.blogPostController.blogPostView.contentView.postButton'].click
    @app['Geniverse.blogPostController.blogPostView.contentView'].isVisibleInWindow.should be_false
    verify_alert(:plain, "OK")
  end
  
  def openBlogPanel
    @blog_button.click
  end
  
end
