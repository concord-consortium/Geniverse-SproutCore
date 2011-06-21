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
      @switch_sex_button = @app['mainPage.genomePanel.genomeView.switchSexButton', 'SC.ButtonView']

      @phenotype_view = @app['mainPage.genomePanel.genomeView.dragonView', 'Geniverse.OrganismView']
      @reveal_button = @app['mainPage.genomePanel.genomeView.dragonView.revealButtonView', 'SC.ButtonView']

      @match_view = @app['mainPage.targetDrakes', 'Geniverse.MatchView']

      @chromosome_controller = @app['Geniverse.chromosomeController', 'SC.ObjectController']
      @match_controller = @app['Geniverse.matchController', 'SC.ArrayController']

      login("student", "password")
      hide_info_pane
    end

    after(:all) do
      stop_testing_servers
    end

    it "should have a female" do
      sleep 3

      @phenotype_view.content.should_not be nil
    end

    it 'should not match by default' do
      verify_incorrect_match
    end

    it 'should count how many times it takes to get a correct match' do
      pending
    end

    it 'should match after changing alleles' do
      change_allele_value('a', 't')

      verify_correct_match
    end

    it 'should complete the challenge after all 4 are matched' do
      change_allele_value('a', 'hl')
      verify_correct_match

      change_allele_value('a', 'h')
      verify_correct_match

      @switch_sex_button.click
      change_allele_value('a', 'w')
      change_allele_value('b', 'w')
      change_allele_value('a', 'fl')
      change_allele_value('b', 'fl')
      change_allele_value('a', 'T')
      change_allele_value('b', 'T')

      sleep 3

      verify_correct_match
      verify_challenge_complete
    end

    def verify_incorrect_match
      @reveal_button.click
      # should pop up an SC.AlertPane
      @app.responding_panes.count.should == 3

      pane = @app.key_pane Lebowski::Foundation::Panes::AlertPane
      pane.should_not be nil
      pane.is_error?.should == true
      pane.button_count.should == 1
      pane.has_button?('Try Again').should == true
      pane.click_button 'Try Again'
    end

    def verify_correct_match
      @reveal_button.click
      # should pop up an SC.AlertPane
      @app.responding_panes.count.should == 3

      pane = @app.key_pane Lebowski::Foundation::Panes::AlertPane
      pane.should_not be nil
      pane.is_plain?.should == true
      pane.button_count.should == 1
      pane.has_button?('OK').should == true
      pane.click_button 'OK'
    end

    def verify_challenge_complete
      # should pop up an SC.AlertPane
      @app.responding_panes.count.should == 3

      pane = @app.key_pane Lebowski::Foundation::Panes::AlertPane
      pane.should_not be nil
      pane.is_plain?.should == true
      pane.button_count.should == 1
      pane.has_button?('OK').should == true
      pane.click_button 'OK'
    end

    def change_allele_value(side, allele)
      allelesMap = @chromosome_controller['allelesMap']
      chromo = allelesMap[allele.downcase]
      chromo_view = @genome_view['chromosome'+side.upcase+chromo+'View']
      pulldowns = chromo_view.pullDowns.child_views
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
