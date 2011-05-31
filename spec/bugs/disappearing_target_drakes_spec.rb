dir = File.expand_path(File.dirname(__FILE__))
require "#{dir}/../support/spec_helper.rb"

describe "Disappearing Target Drakes" do
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
  end

  after(:all) do
    stop_testing_servers
  end

  def drag_to_mother_slot(view)
    tries = 0
    begin
      view.drag_to(@breedView['motherView'], 30, 30)
      @page1mother = @breedDragonController['mother']
      raise "Drag failed!" if @page1mother.nil?
    rescue
      tries += 1
      retry if tries < 3
    end
    @page1mother.should_not be_nil
  end

  def drag_to_father_slot(view)
    tries = 0
    begin
      view.drag_to(@breedView['fatherView'], 30, 30)
      @page1father = @breedDragonController['father']
      raise "Drag failed!" if @page1father.nil?
    rescue
      tries += 1
      retry if tries < 3
    end
    @page1father.should_not be_nil
  end

  it "should not make target dragons disappear when dragging bred dragons into the stable" do
    # navigate to an activity
    # click case log
    @app['topBar.caseLogButton', 'SC.ImageView'].click

    @app.reset_application_context
    # click one of the cases
    @app['caselog.mainPane.mainAppView.inheritance2right', 'SC.View'].click
    @app['inheritance2.mainPane.mainAppView.training2', 'SC.View'].click
    sleep 1

    # close the info popup
    @app['InfoView.contentView.hideButton'].click

    @breedDragonController = @app['Geniverse.breedDragonController', 'SC.Controller']
    # drag a mother and a father to the breed view
    grid = @app['breedingPage.mainPane.mainAppView.challengePoolView.dragonsView.contentView', Lebowski::Foundation::Views::CollectionView]
    @breedView = @app['breedingPage.mainPane.mainAppView.breedView', 'Geniverse.BreedDragonView']

    dragon1 = grid.item_views[0]
    dragon2 = grid.item_views[1]
    sex = dragon1.content.sex
    if sex == 0
      drag_to_father_slot(dragon1)
      drag_to_mother_slot(dragon2)
    else
      drag_to_father_slot(dragon2)
      drag_to_mother_slot(dragon1)
    end

    sleep 1

    # verify that target dragons are visible
    pending "Figure out how to know if the target dragons are still visible..."

    # click breed
    @breedView['breedButtonView'].click
    sleep 2

    # drag a child to the stable
    @breedingPen = @app['breedingPage.mainPane.mainAppView.breedingPenView.penView.contentView', Lebowski::Foundation::Views::CollectionView]
    stable = @app['breedingPage.mainPane.mainAppView.stableView', 'Lab.StableView']
    @breedingPen.item_views[3].drag_to(stable, 30, 30)
    
    # verify target dragons are visible
  end

end
