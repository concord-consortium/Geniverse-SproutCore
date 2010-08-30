require 'spec_helper'

describe DragonsController do
  describe "routing" do
    it "recognizes and generates #index" do
      { :get => "/dragons" }.should route_to(:controller => "dragons", :action => "index")
    end

    it "recognizes and generates #new" do
      { :get => "/dragons/new" }.should route_to(:controller => "dragons", :action => "new")
    end

    it "recognizes and generates #show" do
      { :get => "/dragons/1" }.should route_to(:controller => "dragons", :action => "show", :id => "1")
    end

    it "recognizes and generates #edit" do
      { :get => "/dragons/1/edit" }.should route_to(:controller => "dragons", :action => "edit", :id => "1")
    end

    it "recognizes and generates #create" do
      { :post => "/dragons" }.should route_to(:controller => "dragons", :action => "create") 
    end

    it "recognizes and generates #update" do
      { :put => "/dragons/1" }.should route_to(:controller => "dragons", :action => "update", :id => "1") 
    end

    it "recognizes and generates #destroy" do
      { :delete => "/dragons/1" }.should route_to(:controller => "dragons", :action => "destroy", :id => "1") 
    end
  end
end
