dir = File.expand_path(File.dirname(__FILE__))
require "#{dir}/support/spec_helper.rb"

describe "SC/Rails Integration Test" do
  describe "Case Log" do
    attr_reader :selenium_driver
    alias :page :selenium_driver
    
    before(:all) do
      puts `cd #{dir}/../rails/geniverse; RAILS_ENV=test rake db:migrate; RAILS_ENV=test rake app:setup`
      start_testing_servers
      @selenium_driver = new_test
      page.start_new_browser_session
    end
  
    after(:all) do
      page.close_current_browser_session
      stop_testing_servers
    end
    
    it "will have a run link" do
      page.open "/rails/activities"
      page.text?("Run").should be_true
    end
    
    it "will open the heredity intro sproutcore page" do
      page.open "/rails/activities"
      page.click "//a[@href='/lab#Apprentice/Heredity/Intro']", :wait_for => :page
      page.text?("Heredity - Apprentice - Intro").should be_true
    end
    
    it "will open the heredity individual sproutcore page" do
      page.open "/rails/activities"
      page.click "//a[@href='/lab#Apprentice/Heredity/Individual']", :wait_for => :page
      page.text?("Heredity - Apprentice - Individual").should be_true
    end
    
    it "will open the heredity group sproutcore page" do
      pending "Implement the heredity group page" do
        page.open "/rails/activities"
        page.click "//a[@href='/lab#Apprentice/Heredity/Group']", :wait_for => :page
        page.text?("Heredity - Apprentice - Group").should be_true
      end
    end
  end
end