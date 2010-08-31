dir = File.expand_path(File.dirname(__FILE__))
require "#{dir}/support/spec_helper.rb"

describe "SC/Rails Integration Test" do
  describe "Case Log" do
    before(:all) do
      `cd #{dir}/../rails/geniverse && RAILS_ENV=test rake db:migrate && RAILS_ENV=test rake app:setup`
      start_testing_servers
      @selenium = new_test
      @selenium.start_new_browser_session
    end
  
    after(:all) do
      @selenium.close_current_browser_session
      stop_testing_servers
    end
    
    it "will have a run link" do
      @selenium.open "/rails/activities"
      @selenium.text?("Run").should be_true
    end
    
    it "will open the heredity intro sproutcore page" do
      @selenium.open "/rails/activities"
      @selenium.click "//a[@href='/lab#Apprentice/Heredity/Intro']", :wait_for => :page
      @selenium.text?("Heredity - Apprentice - Intro").should be_true
    end
    
    it "will open the heredity individual sproutcore page" do
      @selenium.open "/rails/activities"
      @selenium.click "//a[@href='/lab#Apprentice/Heredity/Individual']", :wait_for => :page
      @selenium.text?("Heredity - Apprentice - Individual").should be_true
    end
    
    it "will open the heredity group sproutcore page" do
      pending "Implement the heredity group page" do
        @selenium.open "/rails/activities"
        @selenium.click "//a[@href='/lab#Apprentice/Heredity/Group']", :wait_for => :page
        @selenium.text?("Heredity - Apprentice - Group").should be_true
      end
    end
  end
end