dir = File.expand_path(File.dirname(__FILE__))
require "#{dir}/support/spec_helper.rb"

describe "Navigation" do
  before(:all) do
    start_testing_servers
    @app = new_test {|app|
      app['isLoaded'] == true

      app.move_to 1, 1 
      app.resize_to 1024, 768

      define_common_paths(app)
    }

    define_common_ivars

    login("student", "password")
    # navigate to an activity
    # click case log
    @app['topBar.caseLogButton', 'SC.ImageView'].click

    @app.reset_application_context
    # click one of the cases
    @app['caselog.mainPane.mainAppView.journeyman1', 'SC.View'].click
    sleep 1

    breedDragonController = @app['Geniverse.breedDragonController', 'SC.Controller']
    # drag a mother and a father to the breed view
    grid = @app['breedingPage.mainPane.mainAppView.challengePoolView.dragonsView.contentView', Lebowski::Foundation::Views::CollectionView]
    breedView = @app['breedingPage.mainPane.mainAppView.breedView', 'Geniverse.BreedDragonView']
    tries = 0
    begin
      tries += 1
      grid.item_views[1].drag_to(breedView['motherView'], 30, 30)
      @page1mother = breedDragonController['mother']
      redo if @page1mother.nil? && tries < 3
    end
    tries = 0
    begin
      tries += 1
      grid.item_views[2].drag_to(breedView['fatherView'], 30, 30)
      @page1father = breedDragonController['father', 'Geniverse.Dragon']
      redo if @page1father.nil? && tries < 3
    end
    sleep 1

    # record what starter dragons there are
    # NOTE we can't just keep around content, because it will follow any changes made to it over time
    @page1dragons = []
    grid.content.each {|d| @page1dragons << d['id']}

    # click to case log
    @app['topBar.caseLogButton', 'SC.ImageView'].click
    sleep 1

    # click a different case
    @app['caselog.mainPane.mainAppView.journeyman2', 'SC.View'].click
    sleep 1

    # record what start dragons there are
    @page2dragons = []
    grid.content.each {|d| @page2dragons << d['id']}

    @page2mother = breedDragonController['mother']
    @page2father = breedDragonController['father']
  end

  after(:all) do
    stop_testing_servers
  end

  it "will reset the challenge dragons controller after changing pages" do
    @page2dragons.each do |d2|
      @page1dragons.each do |d1|
        d2.should_not eql d1
      end
    end
  end

  it "will reset the breed dragons controller after changing pages" do
    @page2father.should be_nil
    @page2mother.should be_nil
  end

end
