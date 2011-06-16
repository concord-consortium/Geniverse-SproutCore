require 'spec_helper'

describe CasesController do
  describe "routing" do
    it "recognizes and generates #index" do
      { :get => "/cases" }.should route_to(:controller => "cases", :action => "index")
    end

    it "recognizes and generates #new" do
      { :get => "/cases/new" }.should route_to(:controller => "cases", :action => "new")
    end

    it "recognizes and generates #show" do
      { :get => "/cases/1" }.should route_to(:controller => "cases", :action => "show", :id => "1")
    end

    it "recognizes and generates #edit" do
      { :get => "/cases/1/edit" }.should route_to(:controller => "cases", :action => "edit", :id => "1")
    end

    it "recognizes and generates #create" do
      { :post => "/cases" }.should route_to(:controller => "cases", :action => "create") 
    end

    it "recognizes and generates #update" do
      { :put => "/cases/1" }.should route_to(:controller => "cases", :action => "update", :id => "1") 
    end

    it "recognizes and generates #destroy" do
      { :delete => "/cases/1" }.should route_to(:controller => "cases", :action => "destroy", :id => "1") 
    end
  end
end
