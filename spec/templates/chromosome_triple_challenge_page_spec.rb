dir = File.expand_path(File.dirname(__FILE__))
require "#{dir}/../support/spec_helper.rb"

describe "Templates" do
  describe "Chromosome Triple Challenge Page" do

    before(:all) do
      start_testing_servers
      @app = new_test({:app_root_path => "/lab#heredity/challenge/case02"}) {|app|
        app['isLoaded'] == true

        app.move_to 1, 1
        app.resize_to 1024, 768

        define_common_paths(app)
        app.define_path 'mainPage', "chromosomeTripleChallengePage.mainPane.mainAppView"
      }

      define_common_ivars

      @genome_view1 = @app['mainPage.genomePanels.genome1Panel.genomeView', 'Geniverse.DragonGenomeView']
      @switch_sex_button1 = @app['mainPage.genomePanels.genome1Panel.switchSexButton', 'SC.ImageView']
      @phenotype_view1 = @app['mainPage.genomePanels.genome1Panel.phenotypeView', 'Geniverse.OrganismView']

      @genome_view2 = @app['mainPage.genomePanels.genome2Panel.genomeView', 'Geniverse.DragonGenomeView']
      @switch_sex_button2 = @app['mainPage.genomePanels.genome2Panel.switchSexButton', 'SC.ImageView']
      @phenotype_view2 = @app['mainPage.genomePanels.genome2Panel.phenotypeView', 'Geniverse.OrganismView']

      @genome_view3 = @app['mainPage.genomePanels.genome3Panel.genomeView', 'Geniverse.DragonGenomeView']
      @switch_sex_button3 = @app['mainPage.genomePanels.genome3Panel.switchSexButton', 'SC.ImageView']
      @phenotype_view3 = @app['mainPage.genomePanels.genome3Panel.phenotypeView', 'Geniverse.OrganismView']

      @match_view = @app['mainPage.targetDrakes', 'Geniverse.MatchView']
      @reveal_button = @app['mainPage.revealButton', 'SC.ButtonView']

      @chromosome_controller = @app['Geniverse.chromosomeController', 'SC.ObjectController']
      @match_controller = @app['Geniverse.matchController', 'SC.ArrayController']

      @user_controller = @app['Geniverse.userController', 'SC.ObjectController']
      @activity_controller = @app['Geniverse.activityController', 'SC.ObjectController']
      @activity_guid = @activity_controller.guid.to_s

      sleep 5
      hide_info_pane
    end

    after(:all) do
      stop_testing_servers
    end

    it "should have a female" do

      @phenotype_view1.content.should_not be_nil, "First chromosome view should have a starter dragon"
      @phenotype_view1.content.sex.should eq(1), "First chromosome view should have a female starter dragon"

      @phenotype_view2.content.should_not be_nil, "Second chromosome view should have a starter dragon"
      @phenotype_view2.content.sex.should eq(1), "Second chromosome view should have a female starter dragon"

      @phenotype_view3.content.should_not be_nil, "Third chromosome view should have a starter dragon"
      @phenotype_view3.content.sex.should eq(1), "Third chromosome view should have a female starter dragon"
    end

    # Disabled! It was decided that the "Reveal" challenges should start with all pulldowns filled in.
#    it 'should have all empty pulldowns at the start' do
#      [@genome_view1, @genome_view2, @genome_view3].each do |view|
#        ['a','b'].each do |side|
#          ['t','h'].each do |allele|
#            verify_pulldowns_empty(view, side, allele)
#          end
#        end
#      end
#    end
#
#    it 'should have a disabled reveal button until all alleles are selected' do
#      @reveal_button.isEnabled.should be_false, "Reveal button should be disabled when not all alleles are specified"
#      [@genome_view1, @genome_view2, @genome_view3].each do |view|
#        ['a','b'].each do |side|
#          ['t','w','H','Fl','Hl'].each do |allele|
#            change_allele_value(view, side, allele)
#          end
#        end
#      end
#      @reveal_button.isEnabled.should be_true, "Reveal button should be enabled when all alleles are specified"
#    end

    it 'should give an error message when the wrong alleles are selected for all dragons' do
      [@phenotype_view1, @phenotype_view2, @phenotype_view3].each do |view|
        verify_images(view, false)
      end
      verify_incorrect_match("None of the drakes you have created match the target. Please try again.")
    end

    it 'should leave all 3 dragons hidden' do
      @phenotype_view1.hideDragon.should eq(true), "First dragon should be hidden: #{@phenotype_view1.hideDragon}"
      @phenotype_view2.hideDragon.should eq(true), "Second dragon should be hidden: #{@phenotype_view2.hideDragon}"
      @phenotype_view3.hideDragon.should eq(true), "Third dragon should be hidden: #{@phenotype_view3.hideDragon}"
    end

    it 'should give an error message when the wrong alleles are selected for 2 dragons' do
      change_allele_value(@genome_view1, 'a', 't')
      change_allele_value(@genome_view1, 'b', 't')

      verify_images(@phenotype_view1, true)
      [@phenotype_view2, @phenotype_view3].each do |view|
        verify_images(view, false)
      end
      verify_incorrect_match("2 of the drakes you have created don't match the target. Please try again.")
    end

    it 'should leave the 2 incorrect dragons hidden' do
      @phenotype_view1.hideDragon.should be_false, "First dragon should be visible"
      @phenotype_view2.hideDragon.should be_true, "Second dragon should be hidden"
      @phenotype_view3.hideDragon.should be_true, "Third dragon should be hidden"
    end

    it 'should give an error message when the wrong alleles are selected for 1 dragons' do
      change_allele_value(@genome_view2, 'a', 't')
      change_allele_value(@genome_view2, 'b', 't')
      change_allele_value(@genome_view2, 'a', 'hl')
      change_allele_value(@genome_view2, 'b', 'Hl')

      verify_images(@phenotype_view1, true)
      verify_images(@phenotype_view2, true)
      verify_images(@phenotype_view3, false)
      verify_incorrect_match("1 of the drakes you have created doesn't match the target. Please try again.")
    end

    it 'should leave the 1 incorrect dragon hidden' do
      @phenotype_view1.hideDragon.should be_false, "First dragon should be visible"
      @phenotype_view2.hideDragon.should be_false, "Second dragon should be visible"
      @phenotype_view3.hideDragon.should be_true, "Third dragon should be hidden"
    end

    it 'should give an error message when more than one dragon shares the same alleles' do
      change_allele_value(@genome_view3, 'a', 't')
      change_allele_value(@genome_view3, 'b', 't')

      [@phenotype_view1, @phenotype_view2, @phenotype_view3].each do |view|
        verify_images(view, true)
      end
      verify_incorrect_match("Some of your drakes are exactly the same! All of your drakes need to have different alleles.")
    end

    it 'should leave the 2 duplicate dragons hidden' do
      @phenotype_view1.hideDragon.should be_true, "First dragon should be hidden"
      @phenotype_view2.hideDragon.should be_false, "Second dragon should be visible"
      @phenotype_view3.hideDragon.should be_true, "Third dragon should be hidden"
    end

    it 'should give an error message when more than one dragon shares the same alleles and one is incorrect' do
      change_allele_value(@genome_view2, 'a', 'hl')
      change_allele_value(@genome_view2, 'b', 'hl')

      [@phenotype_view1, @phenotype_view3].each do |view|
        verify_images(view, true)
      end
      verify_images(@phenotype_view2, false)
      verify_incorrect_match("1 of the drakes you have created doesn't match the target. Also, some of your drakes are exactly the same! All of your drakes need to have different alleles. Please try again.")
    end

    it 'should leave all dragons hidden' do
      @phenotype_view1.hideDragon.should be_true, "First dragon should be hidden"
      @phenotype_view2.hideDragon.should be_true, "Second dragon should be hidden"
      @phenotype_view3.hideDragon.should be_true, "Third dragon should be hidden"
    end

    it 'should count how many times it takes to get a correct match' do
      pending
    end

    it 'should match after all dragons are correct and different' do
      change_allele_value(@genome_view2, 'b', 'Hl')
      change_allele_value(@genome_view3, 'b', 'Hl')

      verify_correct_match
    end

    it 'should hide all of the dragons again' do
      @phenotype_view1.hideDragon.should be_true, "First dragon should be hidden"
      @phenotype_view2.hideDragon.should be_true, "Second dragon should be hidden"
      @phenotype_view3.hideDragon.should be_true, "Third dragon should be hidden"
    end

    it 'should complete the challenge after all 4 are matched' do
      [@genome_view1, @genome_view2, @genome_view3].each do |view|
        change_allele_value(view, 'a', 'hl')
        change_allele_value(view, 'b', 'hl')
      end
      change_allele_value(@genome_view2, 'b', 'Fl')
      change_allele_value(@genome_view3, 'a', 'fl')
      change_allele_value(@genome_view3, 'b', 'Fl')
      verify_correct_match

      [@genome_view1, @genome_view2, @genome_view3].each do |view|
        change_allele_value(view, 'a', 'h')
        change_allele_value(view, 'b', 'h')
      end
      verify_correct_match

      @switch_sex_button1.click
      @switch_sex_button2.click
      @switch_sex_button3.click
      [@genome_view1, @genome_view2, @genome_view3].each do |view|
        change_allele_value(view, 'a', 'w')
        change_allele_value(view, 'a', 'fl')
        change_allele_value(view, 'b', 'fl')
      end

      change_allele_value(@genome_view1, 'b', 'Hl')

      change_allele_value(@genome_view2, 'a', 'Hl')

      change_allele_value(@genome_view3, 'a', 'Hl')
      change_allele_value(@genome_view3, 'b', 'Hl')

      sleep 3

      verify_correct_match
      verify_challenge_complete
    end

    def verify_incorrect_match(msg = nil)
      @reveal_button.click

      sleep 1  # there's a delay before the results pop up

      verify_alert(:error, "Try again", msg)
    end

    def verify_correct_match
      [@phenotype_view1, @phenotype_view2, @phenotype_view3].each do |view|
        verify_images(view, true)
      end

      @reveal_button.click

      sleep 1  # there's a delay before the results pop up

      verify_alert(:plain, "OK")
    end

    def verify_challenge_complete
      # Check that the correct number of stars were awarded
      expected_stars = [2]

      stars = @user_controller.metadata.stars
      num_stars = stars[@activity_guid]

      num_stars.should eq(expected_stars), "Number of stars should be #{expected_stars.inspect}, was: #{num_stars.inspect}"

      verify_alert(:plain, ["Go back to the case log", "Try again"]) # the challenge alert
    end

    def verify_images(phenotype_view, should_match)
      target_url = @match_view.dragonView.content.imageURL
      target_alleles = @match_view.dragonView.content.alleles
      source_url = phenotype_view.content.imageURL
      source_alleles = phenotype_view.content.alleles
      err_msg = "Image urls should " + (should_match ? "" : "not " ) + "match!\ns: #{source_url}\nt: #{target_url}\ns: #{source_alleles}\nt: #{target_alleles}"
      if should_match
        source_url.should eq(target_url), err_msg
      else
        source_url.should_not eq(target_url), err_msg
      end
    end

    def get_pulldowns(genome_view, side, allele)
      allelesMap = @chromosome_controller['allelesMap']
      chromo = allelesMap[allele.downcase]
      chromo_view = genome_view['chromosome'+side.upcase+chromo+'View']
      pulldowns = chromo_view.pullDowns.child_views
      return pulldowns
    end

    def verify_pulldowns_empty(genome_view, side, allele)
      pulldowns = get_pulldowns(genome_view, side, allele)
      pulldowns.count.times do |i|
        pulldown = pulldowns[i]
        pulldown['fieldValue'].should == ' '
      end
    end

    def change_allele_value(genome_view, side, allele)
      pulldowns = get_pulldowns(genome_view, side, allele)
      pulldowns.count.times do |i|
        pulldown = pulldowns[i]
        pulldown['objects'].count.times do |j|
          if pulldown['objects'][j]['value'] == allele
            # we found the correct pulldown
            select_option(pulldown, allele)
            return
          end
        end
      end
      false.should == true
    end

    def select_option(pulldown, allele)
      alleleLabelMap = @chromosome_controller['alleleLabelMap']
      count = 0
      while pulldown['fieldValue'] != allele
        puts "selecting (#{count}): #{allele}"
        return nil if count > 4
        # select_with_value turned out to be pretty unreliable. select_with_name seems to work much better
        pulldown.select_with_name alleleLabelMap[allele] if count > 0
        sleep 0.5
        count += 1
      end
    end

  end
end
