require 'spec_helper'

describe HelpMessagesController do
  describe "routing" do
    it "recognizes and generates #index" do
      { :get => "/help_messages" }.should route_to(:controller => "help_messages", :action => "index")
    end

    it "recognizes and generates #new" do
      { :get => "/help_messages/new" }.should route_to(:controller => "help_messages", :action => "new")
    end

    it "recognizes and generates #show" do
      { :get => "/help_messages/1" }.should route_to(:controller => "help_messages", :action => "show", :id => "1")
    end

    it "recognizes and generates #edit" do
      { :get => "/help_messages/1/edit" }.should route_to(:controller => "help_messages", :action => "edit", :id => "1")
    end

    it "recognizes and generates #create" do
      { :post => "/help_messages" }.should route_to(:controller => "help_messages", :action => "create") 
    end

    it "recognizes and generates #update" do
      { :put => "/help_messages/1" }.should route_to(:controller => "help_messages", :action => "update", :id => "1") 
    end

    it "recognizes and generates #destroy" do
      { :delete => "/help_messages/1" }.should route_to(:controller => "help_messages", :action => "destroy", :id => "1") 
    end
  end
end
