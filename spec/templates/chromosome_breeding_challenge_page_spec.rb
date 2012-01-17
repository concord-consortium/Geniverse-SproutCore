dir = File.expand_path(File.dirname(__FILE__))
require "#{dir}/../support/spec_helper.rb"

describe "Templates" do
  describe "Chromosome Breeding Page" do

    before(:all) do
      start_testing_servers
      @app = new_test({:app_root_path => "/lab#pagetype/reference/chromosomeBreedingChallengePage"}) {|app|
        app['isLoaded'] == true

        app.move_to 1, 1 
        app.resize_to 1024, 768

        define_common_paths(app)
        app.define_path 'breedPage', "chromosomeBreedingChallengePage.mainPane.mainAppView"
      }

      define_common_ivars

      @female_genome_view = @app['breedPage.genomePanel.femaleGenomeView', 'Geniverse.DragonGenomeView']
      @male_genome_view = @app['breedPage.genomePanel.maleGenomeView', 'Geniverse.DragonGenomeView']

      @female_phenotype_view = @app['breedPage.genomePanel.femalePhenotypeView', 'Geniverse.OrganismView']
      @male_phenotype_view = @app['breedPage.genomePanel.malePhenotypeView', 'Geniverse.OrganismView']

      @breed_button = @app['breedPage.genomePanel.breedButton', 'SC.ButtonView']
      @breeding_pen_view = @app['breedPage.breedingPenView', 'Lab.BreedingPenView']

      @match_view = @app['breedPage.matchView', 'Geniverse.MatchView']

      @chromosome_controller = @app['Geniverse.chromosomeController', 'SC.ObjectController']

      @user_controller = @app['Geniverse.userController', 'SC.ObjectController']
      @activity_controller = @app['Geniverse.activityController', 'SC.ObjectController']
      @activity_guid = @activity_controller.guid.to_s

      @scoring_controller = @app['Geniverse.scoringController', 'SC.Controller']

      hide_info_pane
    end

    after(:all) do
      stop_testing_servers
    end

    it "should have a male and a female" do
      sleep 3

      @female_phenotype_view.content.should_not be nil
      @male_phenotype_view.content.should_not be nil
    end

    def change_pulldown_value(pulldowns, current_allele, new_allele)
      alleleLabelMap = @chromosome_controller['alleleLabelMap']
      puts "there are #{pulldowns.count} pulldowns"
      pulldowns.count.times do |i|
        pulldown = pulldowns[i]
        if pulldown['fieldValue'] == current_allele
          # we found the right pulldown. select one of the other options
              count = 0
              while pulldown['fieldValue'] != new_allele
                puts "selecting (#{count}): #{new_allele}"
                return nil if count > 4
                # select_with_value turned out to be pretty unreliable. select_with_name seems to work much better
                pulldown.select_with_name alleleLabelMap[current_allele] if count > 0
                pulldown.select_with_name alleleLabelMap[new_allele]
                sleep 0.5
                count += 1
              end
              return new_allele
        end
      end
      return nil
    end

    it "should be able to breed 20 dragons" do
      @breed_button.click
      sleep 3
      breeding_pen_organism_views(@breeding_pen_view).count.should == 20
    end

    def verify_match(should_match = true)
      # drag a bred organism to the match organism
      pen_orgs = breeding_pen_organism_views(@breeding_pen_view)
      org_to_match = match_organism_views(@match_view)[0]
      pen_org = get_matching_org_view(pen_orgs, org_to_match, should_match)

      pen_org.drag_to org_to_match, 30, 30

      sleep 1

      if should_match
        verify_alert(:plain, "OK")
      else
        # should pop up an SC.AlertPane
        verify_alert(:error, "Try again")
      end
    end

    it "should not match initially" do
      verify_match(false)
    end

    def change_alleles(chromo, current_allele, new_allele)
      [@female_genome_view, @male_genome_view].each do |genome_view|
        ['A','B'].each do |side|
          view_attr = "chromosome#{side}#{chromo.upcase}View"
          puts "Looking for: #{view_attr}"
          chromo_view = genome_view[view_attr]
          chromo_view.should_not be_nil
          puts "found chromoview"
          new_val = change_pulldown_value(chromo_view.pullDowns.child_views, current_allele, new_allele)
          new_val.should_not be_nil
        end
      end
      sleep 1
    end

    it "should match after changing alleles" do
      change_alleles('1','W','w')
      @breed_button.click
      sleep 3

      verify_match(true)
    end

    it "should complete challenge after all matches" do
      change_alleles('2','H','h')
      @breed_button.click
      sleep 3

      verify_match(true)

      change_alleles('2','Fl','fl')
      @breed_button.click
      sleep 3

      verify_match(true)
      verify_alert(:plain, "OK") # the challenge alert

      # Check that the correct number of stars were awarded
      expected_stars = [1]

      stars = @user_controller.metadata.stars
      num_stars = stars[@activity_guid]

      num_stars.should eq(expected_stars), "Number of stars should be #{expected_stars.inspect}, was: #{num_stars.inspect}"
    end

  end
end
