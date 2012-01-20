dir = File.expand_path(File.dirname(__FILE__))
require "#{dir}/../support/spec_helper.rb"

describe "Templates" do
  describe "Chromosome Challenge Page" do

    before(:all) do
      start_testing_servers
      @app = new_test({:app_root_path => "/lab#heredity/challenge/case01"}) {|app|
        app['isLoaded'] == true

        app.move_to 1, 1
        app.resize_to 1024, 768

        define_common_paths(app)
        app.define_path 'mainPage', "chromosomeChallengePage.mainPane.mainAppView"
      }

      define_common_ivars

      @genome_view = @app['mainPage.genomePanel.genomeView', 'Geniverse.DragonGenomeView']
      @switch_sex_button = @app['mainPage.genomePanel.switchSexButton', 'SC.ImageView']

      @phenotype_view = @app['mainPage.genomePanel.genomeView.dragonView', 'Geniverse.OrganismView']
      @reveal_button = @app['mainPage.genomePanel.genomeView.dragonView.revealButtonView', 'SC.ButtonView']

      @score_view = @app['mainPage.scoreLabel', 'Geniverse.ScoreView']
      @match_view = @app['mainPage.targetDrakes', 'Geniverse.MatchView']

      @chromosome_controller = @app['Geniverse.chromosomeController', 'SC.ObjectController']
      @match_controller = @app['Geniverse.matchController', 'SC.ArrayController']

      @user_controller = @app['Geniverse.userController', 'SC.ObjectController']
      @activity_controller = @app['Geniverse.activityController', 'SC.ObjectController']
      @activity_guid = @activity_controller.guid.to_s

      @scoring_controller = @app['Geniverse.scoringController', 'SC.Controller']

      sleep 5
      hide_info_pane
      @first_dragon_id = @match_controller['currentDragon']['guid']
    end

    after(:all) do
      stop_testing_servers
    end

    it "should have a female" do
      @phenotype_view.content.should_not be nil
    end

#    it 'should have all empty pulldowns at the start' do
#      verify_pulldowns_empty('a', 't')
#      verify_pulldowns_empty('b', 't')
#      verify_pulldowns_empty('a', 'h')
#      verify_pulldowns_empty('b', 'h')
#    end
#
#    it 'should have a disabled reveal button until all alleles are selected' do
#      @reveal_button.isEnabled.should be_false, "Reveal button should be disabled when not all alleles are specified"
#
#      change_allele_value('a', 't')
#      change_allele_value('b', 't')
#      change_allele_value('a', 'W')
#      change_allele_value('b', 'W')
#      change_allele_value('a', 'h')
#      change_allele_value('b', 'h')
#      change_allele_value('a', 'Fl')
#      change_allele_value('b', 'Fl')
#      change_allele_value('a', 'Hl')
#      change_allele_value('b', 'Hl')
#
#      @reveal_button.isEnabled.should be_true, "Reveal button should be enabled when all alleles are specified"
#    end

    it 'should track how many changes it takes to get a match' do
      @score_view.scoreView['value'].should eq("Your moves: 0"), "Score should start at 0: was #{@score_view.scoreView['value'].inspect}"
    end

    it 'should give an error message when the wrong alleles are selected' do
      verify_incorrect_match
    end

    it 'should increment moves when wrong alleles are selected' do
      @score_view.scoreView['value'].should eq("Your moves: 1"), "Score should start at 1: was #{@score_view.scoreView['value'].inspect}"
    end

    it 'should correctly load the star scoring values' do
      @scoring_controller.threeStarThreshold.should == 1
      @scoring_controller.twoStarThreshold.should == 2
      @scoring_controller.minimumScore.should == 1
      @scoring_controller.numberOfTrials.should == 4
      @scoring_controller.threeStarChallengeThreshold.should == 4
      @scoring_controller.twoStarChallengeThreshold.should == 8
    end

    it 'should increment the score by 1 whenever an allele is changed' do
      change_allele_value('a', 't')

      @score_view.scoreView['value'].should eq("Your moves: 2"), "Score should show 2: was #{@score_view.scoreView['value'].inspect}"
    end

    it 'should not increment the score if the allele value does not change' do
      change_allele_value('b', 't')

      @score_view.scoreView['value'].should eq("Your moves: 2"), "Score should still show 2: was #{@score_view.scoreView['value'].inspect}"
    end

    it 'should increment the score by 1 whenever the sex is changed' do
      @switch_sex_button.click
      sleep 1
      @switch_sex_button.click

      @score_view.scoreView['value'].should eq("Your moves: 4"), "Score should be 4: was #{@score_view.scoreView['value'].inspect}"
      @scoring_controller.currentScore.should == 4
      @scoring_controller.currentChallengeScore.should == 4
    end

    it 'should have achieved 1 stars' do
      @scoring_controller.achievedStars.should == 1
      @scoring_controller.targetChallengeScore.should == 5 # 1 move + (1*4) threshold
    end

    it 'should match after changing alleles' do
      verify_correct_match
    end

    it 'should reset the score after the match is correct' do
      @score_view.scoreView['value'].should eq("Your moves: 0"), "Score should reset to 0 after a match"
      @scoring_controller.currentChallengeScore.should == 4
      @scoring_controller.targetChallengeScore.should == 6 # 2 move + (1*4) threshold
    end

    it 'should correctly track things after the 2nd trial' do
      change_allele_value('a', 'hl')
      change_allele_value('b', 'hl')
      @scoring_controller.achievedStars.should == 3
      verify_correct_match
      @scoring_controller.currentChallengeScore.should == 5
      @scoring_controller.targetChallengeScore.should == 7 # 3 move + (1*4) threshold
    end

    it 'should correctly track things after the 3rd trial' do
      change_allele_value('a', 'h')
      change_allele_value('b', 'h')
      @scoring_controller.achievedStars.should == 3
      verify_correct_match
      @scoring_controller.currentChallengeScore.should == 6
    end

    it 'should correctly track things after the 4th trial' do
      @switch_sex_button.click
      change_allele_value('a', 'Hl')
      change_allele_value('b', 'Hl')
      change_allele_value('a', 'hl')
      change_allele_value('b', 'hl')
      change_allele_value('a', 'w')
      change_allele_value('b', 'w')
      change_allele_value('a', 'fl')
      change_allele_value('b', 'fl')
      @scoring_controller.achievedStars.should == 1
      @scoring_controller.currentChallengeScore.should == 13
      @scoring_controller.targetChallengeScore.should == 10 # 6 move + (1*4) threshold
      @scoring_controller.achievedChallengeStars.should == 2
    end

    it 'should complete the challenge after all 4 are matched' do
      sleep 3

      verify_correct_match
      verify_challenge_complete
    end

    it 'should cycle back to to the first target dragon' do
      @match_controller['currentDragonIdx'].should == 0
    end

    it 'should not know that the first dragon was previously matched' do
      @match_controller['currentDragon']['hasBeenMatched'].should be_false, "Match dragon should not have been marked as matched"
    end

    it 'should reset the challenge score' do
      @scoring_controller.currentChallengeScore.should == 0
    end

    def verify_incorrect_match
      verify_images(false)

      @reveal_button.click

      sleep 1  # there's a delay before the results pop up

      verify_alert(:error, "Try again")
    end

    def verify_correct_match
      verify_images(true)

      @reveal_button.click

      sleep 1  # there's a delay before the results pop up

      verify_alert(:plain, "OK")
    end

    def verify_challenge_complete
      verify_alert(:plain, "OK")

      # Check that the correct number of stars were awarded
      expected_stars = [2]

      stars = @user_controller.metadata.stars
      num_stars = stars[@activity_guid]

      num_stars.should eq(expected_stars), "Number of stars should be #{expected_stars.inspect}, was: #{num_stars.inspect}"
    end

    def verify_images(should_match)
      target_url = @match_view.dragonView.content.imageURL
      target_alleles = @match_view.dragonView.content.alleles
      source_url = @phenotype_view.content.imageURL
      source_alleles = @phenotype_view.content.alleles
      err_msg = "Image urls should " + (should_match ? "" : "not " ) + "match!\ns: #{source_url}\nt: #{target_url}\ns: #{source_alleles}\nt: #{target_alleles}"
      if should_match
        source_url.should eq(target_url), err_msg
      else
        source_url.should_not eq(target_url), err_msg
      end
    end

    def get_pulldowns(side, allele)
      allelesMap = @chromosome_controller['allelesMap']
      chromo = allelesMap[allele.downcase]
      chromo_view = @genome_view['chromosome'+side.upcase+chromo+'View']
      pulldowns = chromo_view.pullDowns.child_views
      return pulldowns
    end

    def verify_pulldowns_empty(side, allele)
      pulldowns = get_pulldowns(side, allele)
      pulldowns.count.times do |i|
        pulldown = pulldowns[i]
        pulldown['fieldValue'].should == ' '
      end
    end

    def change_allele_value(side, allele)
      pulldowns = get_pulldowns(side, allele)
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
