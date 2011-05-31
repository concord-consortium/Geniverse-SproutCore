dir = File.expand_path(File.dirname(__FILE__))
require "#{dir}/../support/spec_helper.rb"

describe "Templates" do
  describe "Chromosome Breeding Page" do

    before(:all) do
      start_testing_servers
      @app = new_test({:app_root_path => "/lab#pagetype/reference/chromosomeBreedingPage"}) {|app|
        app['isLoaded'] == true

        app.move_to 1, 1 
        app.resize_to 1024, 768

        define_common_paths(app)
        app.define_path 'breedPage', "chromosomeBreedingPage.mainPane.mainAppView"
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

      login("student", "password")
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

    def pulldowns_contains_allele?(pulldowns, allele)
      pulldowns.count.times do |i|
        pulldown = pulldowns[i]
        return true if pulldown['fieldValue'] == allele
      end
      return false
    end

    it "should have pulldowns which match the actual alleles" do
      allelesMap = @chromosome_controller['allelesMap']

      [[@female_phenotype_view.content, @female_genome_view],[@male_phenotype_view.content, @male_genome_view]].each do |info|
        organism = info[0]
        genome_view = info[1]

        # cycle through each allele, and match it to the correct pulldown
        organism['alleles'].split(',').each do |allele_str|
          side, allele = allele_str.split(':')
          chromo = allelesMap[allele.downcase]
          chromo_view = genome_view['chromosome'+side.upcase+chromo+'View']
          next if pulldowns_contains_allele?(chromo_view.pullDowns.child_views, allele)
          false.should == true
        end
      end
    end

    def change_pulldown_value(pulldowns, allele)
      alleleLabelMap = @chromosome_controller['alleleLabelMap']
      pulldowns.count.times do |i|
        pulldown = pulldowns[i]
        if pulldown['fieldValue'] == allele
          # we found the right pulldown. select one of the other options
          opts = pulldown['objects']
          opts.count.times do |i|
            opt = opts[i]
            if opt['value'] != allele && opt['value'] != 'dl'  # avoid dead dragons...
              count = 0
              while pulldown['fieldValue'] != opt['value']
                puts "selecting (#{count}): #{opt['value']}"
                return nil if count > 4
                # select_with_value turned out to be pretty unreliable. select_with_name seems to work much better
                pulldown.select_with_name alleleLabelMap[allele] if count > 0
                pulldown.select_with_name alleleLabelMap[opt['value']]
                sleep 0.5
                count += 1
              end
              return opt['value']
            end
          end
        end
      end
      return nil
    end

    it "should change the dragon phenotype when each pulldown is changed" do
      allelesMap = @chromosome_controller['allelesMap']

      organism = @female_phenotype_view.content
      genome_view = @female_genome_view

      # cycle through each allele, and change the pulldown to a new value. make sure the dragon phenotype view changes
      alleles = organism['alleles'].split(',')
      alleles.each do |allele_str|
        side, allele = allele_str.split(':')
        chromo = allelesMap[allele.downcase]
        chromo_view = genome_view['chromosome'+side.upcase+chromo+'View']
        new_val = change_pulldown_value(chromo_view.pullDowns.child_views, allele)
        new_val.should_not be nil
        sleep 1.5
        @female_phenotype_view.content['alleles'].should match("#{side}:#{new_val}")
      end
    end

    it "should be able to breed 20 dragons" do
      @breed_button.click
      sleep 3
      breeding_pen_organism_views(@breeding_pen_view).count.should == 20
    end

  end
end
