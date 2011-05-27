dir = File.expand_path(File.dirname(__FILE__))
require "#{dir}/support/spec_helper.rb"

describe "Geniverse Dragons Test" do
  

  before(:all) do
    start_testing_servers
    @app = new_test({:app_root_path => "/lab#pagetype/reference/breedingPage"}) {|app|
      app['isLoaded'] == true

      app.move_to 1, 1 
      app.resize_to 1024, 768

      define_common_paths(app)
      app.define_path 'breedPage', "breedingPage.mainPane.mainAppView"
    }

    define_common_ivars

    @challenge_pool_view = @app['breedPage.challengePoolView', 'Lab.ChallengePoolView']
    @chromosome_tool_button = @app['breedPage.challengeChromosomeToolView', 'Geniverse.ChromosomeToolView']
    @breed_view = @app['breedPage.breedView', 'Geniverse.BreedDragonView']
    @mother_view = @app['breedPage.breedView.motherView', 'Geniverse.OrganismView']
    @father_view = @app['breedPage.breedView.fatherView', 'Geniverse.OrganismView']
    @breed_button = @app['breedPage.breedView.breedButtonView', 'SC.ButtonView']
    @breeding_pen_view = @app['breedPage.breedingPenView', 'Lab.BreedingPenView']
    @stable_view = @app['breedPage.stableView', 'Lab.StableView']
    @target_view = @app['breedPage.matchView', 'Geniverse.MatchView']
    @marketplace_view = @app['breedPage.marketplaceView', 'SC.ImageView']

    @chromosome_tool_controller = @app['Geniverse.chromosomeToolController', 'SC.Controller']

    login("student", "password")
    hide_info_pane
  end
  
  after(:all) do
    stop_testing_servers
  end

  it "should have challenge pool with 4 dragons" do
    sleep 3

    @challenge_pool_view.dragons_view.content_view.child_views.count.should == 4
  end
  
  it "should be able to drag mother and father from challenge pool to breed view" do
    mother = get_female_from_challenge_pool(@challenge_pool_view)
    father = get_male_from_challenge_pool(@challenge_pool_view)

    father.drag_to @father_view, 20, 20
    mother.drag_to @mother_view, 20, 20

    @breed_view.mother.should_not be nil
    @breed_view.father.should_not be nil
  end
  
  it "should be able to breed 20 dragons" do
    
    @breed_button.click
    sleep 3
    dragon1 = breeding_pen_organism_views(@breeding_pen_view).count.should == 20
  end
  
  it "should replace the 20 dragons when breeding again" do
    @breed_button.click
    sleep 3
    dragon1 = breeding_pen_organism_views(@breeding_pen_view).count.should == 20
  end
  
  it "should be able to view genome of one of the bred dragons" do
    @breed_button.click
    sleep 3
    dragon3 = breeding_pen_organism_views(@breeding_pen_view)[2]
    dragon3.click
    
    @chromosome_tool_button.click
    
    # TODO verify that the correct dragon was shown...
    # dragon3.organism.should be @chromosome_tool_controller.dragon
    
    @chromosome_tool_controller.paneInstance.contentView.hideButton.click
  end
  
  it "should be able to drag dragons from breeding pen to stable" do
    stable_organism_views(@stable_view).count.should == 0
    
    dragon1view = breeding_pen_organism_views(@breeding_pen_view)[0]
    alleles = dragon1view.content['alleles']
    
    dragon1view.drag_to @stable_view, 20, 20
    
    stable_organism_views(@stable_view).count.should == 1
    breeding_pen_organism_views(@breeding_pen_view).count.should == 19
    stable_organism_views(@stable_view)[0].content['alleles'].should == alleles
  end
  
  it "should be able to drag dragons to anywhere in stable" do
     dragon2 = breeding_pen_organism_views(@breeding_pen_view)[1]
     dragon3 = breeding_pen_organism_views(@breeding_pen_view)[2]
     
     dragon2.drag_to @stable_view, 100, 100
     sleep 1
     dragon3.drag_to @stable_view, 10, 20
     
     stable_organism_views(@stable_view).count.should == 3
     breeding_pen_organism_views(@breeding_pen_view).count.should == 17
   end
   
   it "should always add new dragons to the end" do
     dragon4view = breeding_pen_organism_views(@breeding_pen_view)[1]
     alleles4 = dragon4view.content['alleles']
     
     dragon4view.drag_to @stable_view, 100, 100
     stable_organism_views(@stable_view).count.should == 4
     stable_organism_views(@stable_view)[3].content['alleles'].should == alleles4
     
     dragon5view = breeding_pen_organism_views(@breeding_pen_view)[2]
     alleles5 = dragon5view.content['alleles']
     
     dragon5view.drag_to @stable_view, 5, 20
     stable_organism_views(@stable_view).count.should == 5
     stable_organism_views(@stable_view)[4].content['alleles'].should == alleles5
   end
 
end
