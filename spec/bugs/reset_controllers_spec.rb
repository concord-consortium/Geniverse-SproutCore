dir = File.expand_path(File.dirname(__FILE__))
require "#{dir}/../support/spec_helper.rb"

describe "Navigating pages resets controllers" do
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
    challenge_pool = @app['breedingPage.mainPane.mainAppView.challengePoolView', 'Lab.ChallengePoolView']
    breedView = @app['breedingPage.mainPane.mainAppView.breedView', 'Geniverse.BreedDragonView']

    mother = get_female_from_challenge_pool(challenge_pool)
    father = get_male_from_challenge_pool(challenge_pool)

    tries = 0
    begin
      tries += 1
      mother.drag_to(breedView['motherView'], 30, 30)
      @page1mother = breedDragonController['mother']
      redo if @page1mother.nil? && tries < 3
    end
    tries = 0
    begin
      tries += 1
      father.drag_to(breedView['fatherView'], 30, 30)
      @page1father = breedDragonController['father']
      redo if @page1father.nil? && tries < 3
    end
    sleep 1

    # record what starter dragons there are
    # NOTE we can't just keep around content, because it will follow any changes made to it over time
    @page1dragons = []
    organism_views = challenge_pool.dragons_view.content_view.child_views
    i = 0
    while i < organism_views.count
      @page1dragons << organism_views[i].content['id'].to_s
      i += 1
    end

    # click to case log
    @app['topBar.caseLogButton', 'SC.ImageView'].click
    sleep 1

    # click a different case
    @app['caselog.mainPane.mainAppView.journeyman2', 'SC.View'].click
    sleep 1

    # record what start dragons there are
    @page2dragons = []
    organism_views = challenge_pool.dragons_view.content_view.child_views
    i = 0
    while i < organism_views.count
      @page2dragons << organism_views[i].content['id'].to_s
      i += 1
    end

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
