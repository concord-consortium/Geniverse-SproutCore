require 'spec_helper'

describe CasesController do

  def mock_case(stubs={})
    @mock_case ||= mock_model(Case, stubs)
  end

  describe "GET index" do
    it "assigns all cases as @cases" do
      Case.stub(:find).with(:all).and_return([mock_case])
      get :index
      assigns[:cases].should == [mock_case]
    end
  end

  describe "GET show" do
    it "assigns the requested case as @case" do
      Case.stub(:find).with("37").and_return(mock_case)
      get :show, :id => "37"
      assigns[:case].should equal(mock_case)
    end
  end

  describe "GET new" do
    it "assigns a new case as @case" do
      Case.stub(:new).and_return(mock_case)
      get :new
      assigns[:case].should equal(mock_case)
    end
  end

  describe "GET edit" do
    it "assigns the requested case as @case" do
      Case.stub(:find).with("37").and_return(mock_case)
      get :edit, :id => "37"
      assigns[:case].should equal(mock_case)
    end
  end

  describe "POST create" do

    describe "with valid params" do
      it "assigns a newly created case as @case" do
        Case.stub(:new).with({'these' => 'params'}).and_return(mock_case(:save => true))
        post :create, :case => {:these => 'params'}
        assigns[:case].should equal(mock_case)
      end

      it "redirects to the created case" do
        Case.stub(:new).and_return(mock_case(:save => true))
        post :create, :case => {}
        response.should redirect_to(case_url(mock_case))
      end
    end

    describe "with invalid params" do
      it "assigns a newly created but unsaved case as @case" do
        Case.stub(:new).with({'these' => 'params'}).and_return(mock_case(:save => false))
        post :create, :case => {:these => 'params'}
        assigns[:case].should equal(mock_case)
      end

      it "re-renders the 'new' template" do
        Case.stub(:new).and_return(mock_case(:save => false))
        post :create, :case => {}
        response.should render_template('new')
      end
    end

  end

  describe "PUT update" do

    describe "with valid params" do
      it "updates the requested case" do
        Case.should_receive(:find).with("37").and_return(mock_case)
        mock_case.should_receive(:update_attributes).with({'these' => 'params'})
        put :update, :id => "37", :case => {:these => 'params'}
      end

      it "assigns the requested case as @case" do
        Case.stub(:find).and_return(mock_case(:update_attributes => true))
        put :update, :id => "1"
        assigns[:case].should equal(mock_case)
      end

      it "redirects to the case" do
        Case.stub(:find).and_return(mock_case(:update_attributes => true))
        put :update, :id => "1"
        response.should redirect_to(case_url(mock_case))
      end
    end

    describe "with invalid params" do
      it "updates the requested case" do
        Case.should_receive(:find).with("37").and_return(mock_case)
        mock_case.should_receive(:update_attributes).with({'these' => 'params'})
        put :update, :id => "37", :case => {:these => 'params'}
      end

      it "assigns the case as @case" do
        Case.stub(:find).and_return(mock_case(:update_attributes => false))
        put :update, :id => "1"
        assigns[:case].should equal(mock_case)
      end

      it "re-renders the 'edit' template" do
        Case.stub(:find).and_return(mock_case(:update_attributes => false))
        put :update, :id => "1"
        response.should render_template('edit')
      end
    end

  end

  describe "DELETE destroy" do
    it "destroys the requested case" do
      Case.should_receive(:find).with("37").and_return(mock_case)
      mock_case.should_receive(:destroy)
      delete :destroy, :id => "37"
    end

    it "redirects to the cases list" do
      Case.stub(:find).and_return(mock_case(:destroy => true))
      delete :destroy, :id => "1"
      response.should redirect_to(cases_url)
    end
  end

end
