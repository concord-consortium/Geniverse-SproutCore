require "#{File.dirname(__FILE__)}/support/spec_helper.rb"

describe "SC/Rails Integration Test" do
  describe "Case Log" do
    before(:all) do    
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
    
    @javascript
    it "will open the correct sproutcore page" do
      @selenium.open "/rails/activities"
      @selenium.click "link=Run", :wait_for => :page
      @selenium.text?("Heredity - Apprentice - Intro").should be_true
    end
  end
end