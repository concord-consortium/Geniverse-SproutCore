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

      hide_info_pane
    end

    after(:all) do
      stop_testing_servers
    end

    it "should have a female" do
      sleep 3

      @phenotype_view.content.should_not be nil
    end

    it 'should have all empty pulldowns at the start' do
      verify_pulldowns_empty('a', 't')
      verify_pulldowns_empty('b', 't')
      verify_pulldowns_empty('a', 'h')
      verify_pulldowns_empty('b', 'h')
    end

    it 'should have a disabled reveal button until all alleles are selected' do
      @reveal_button.isEnabled.should be_false, "Reveal button should be disabled when not all alleles are specified"

      change_allele_value('a', 't')
      change_allele_value('b', 't')
      change_allele_value('a', 'W')
      change_allele_value('b', 'W')
      change_allele_value('a', 'h')
      change_allele_value('b', 'h')
      change_allele_value('a', 'Fl')
      change_allele_value('b', 'Fl')
      change_allele_value('a', 'Hl')
      change_allele_value('b', 'Hl')

      @reveal_button.isEnabled.should be_true, "Reveal button should be enabled when all alleles are specified"
    end

    it 'should give an error message when the wrong alleles are selected' do
      verify_incorrect_match
    end
    it 'should count how many times it takes to get a correct match' do
      pending
    end

    it 'should match after changing alleles' do
      change_allele_value('a', 'H')
      change_allele_value('b', 'H')

      verify_correct_match
    end

    it 'should complete the challenge after all 4 are matched' do
      change_allele_value('a', 'hl')
      change_allele_value('b', 'hl')
      verify_correct_match

      change_allele_value('a', 'h')
      change_allele_value('b', 'h')
      verify_correct_match

      @switch_sex_button.click
      change_allele_value('a', 'w')
      change_allele_value('b', 'w')
      change_allele_value('a', 'fl')
      change_allele_value('b', 'fl')

      sleep 3

      verify_correct_match
      verify_challenge_complete
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
