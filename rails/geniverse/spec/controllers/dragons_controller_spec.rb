require 'spec_helper'

describe DragonsController do

  def mock_dragon(stubs={})
    @mock_dragon ||= mock_model(Dragon, stubs)
  end

  describe "GET index" do
    it "assigns all dragons as @dragons" do
      Dragon.stub(:find).with(:all, {:conditions=>{}}).and_return([mock_dragon])
      get :index
      assigns[:dragons].should == [mock_dragon]
    end
  end

  describe "GET show" do
    it "assigns the requested dragon as @dragon" do
      Dragon.stub(:find).with("37").and_return(mock_dragon)
      get :show, :id => "37"
      assigns[:dragon].should equal(mock_dragon)
    end
  end

  describe "GET new" do
    it "assigns a new dragon as @dragon" do
      Dragon.stub(:new).and_return(mock_dragon)
      get :new
      assigns[:dragon].should equal(mock_dragon)
    end
  end

  describe "GET edit" do
    it "assigns the requested dragon as @dragon" do
      Dragon.stub(:find).with("37").and_return(mock_dragon)
      get :edit, :id => "37"
      assigns[:dragon].should equal(mock_dragon)
    end
  end

  describe "POST create" do

    describe "with valid params" do
      it "assigns a newly created dragon as @dragon" do
        Dragon.stub(:new).with({'these' => 'params'}).and_return(mock_dragon(:save => true))
        post :create, :dragon => {:these => 'params'}
        assigns[:dragon].should equal(mock_dragon)
      end

      it "redirects to the created dragon" do
        Dragon.stub(:new).and_return(mock_dragon(:save => true))
        post :create, :dragon => {}
        response.should redirect_to(dragon_url(mock_dragon))
      end
    end

    describe "with invalid params" do
      it "assigns a newly created but unsaved dragon as @dragon" do
        Dragon.stub(:new).with({'these' => 'params'}).and_return(mock_dragon(:save => false))
        post :create, :dragon => {:these => 'params'}
        assigns[:dragon].should equal(mock_dragon)
      end

      it "re-renders the 'new' template" do
        Dragon.stub(:new).and_return(mock_dragon(:save => false))
        post :create, :dragon => {}
        response.should render_template('new')
      end
    end

  end

  describe "PUT update" do

    describe "with valid params" do
      it "updates the requested dragon" do
        Dragon.should_receive(:find).with("37").and_return(mock_dragon)
        mock_dragon.should_receive(:update_attributes).with({'these' => 'params'})
        put :update, :id => "37", :dragon => {:these => 'params'}
      end

      it "assigns the requested dragon as @dragon" do
        Dragon.stub(:find).and_return(mock_dragon(:update_attributes => true))
        put :update, :id => "1", :dragon => {}
        assigns[:dragon].should equal(mock_dragon)
      end

      it "redirects to the dragon" do
        Dragon.stub(:find).and_return(mock_dragon(:update_attributes => true))
        put :update, :id => "1", :dragon => {}
        response.should redirect_to(dragon_url(mock_dragon))
      end
    end

    describe "with invalid params" do
      it "updates the requested dragon" do
        Dragon.should_receive(:find).with("37").and_return(mock_dragon)
        mock_dragon.should_receive(:update_attributes).with({'these' => 'params'})
        put :update, :id => "37", :dragon => {:these => 'params'}
      end

      it "assigns the dragon as @dragon" do
        Dragon.stub(:find).and_return(mock_dragon(:update_attributes => false))
        put :update, :id => "1", :dragon => {}
        assigns[:dragon].should equal(mock_dragon)
      end

      it "re-renders the 'edit' template" do
        Dragon.stub(:find).and_return(mock_dragon(:update_attributes => false))
        put :update, :id => "1", :dragon => {}
        response.should render_template('edit')
      end
    end
    
    describe "with json requests" do
      describe "with valid params" do
        it "updates the requested dragon" do
          Dragon.should_receive(:find).with("37").and_return(mock_dragon)
          mock_dragon.should_receive(:update_attributes).with({'these' => 'params'})
          put :update, :format => :json, :id => "37", :dragon => {:these => 'params'}
        end

        it "assigns the requested dragon as @dragon" do
          Dragon.stub(:find).and_return(mock_dragon(:update_attributes => true))
          put :update, :format => :json, :id => "1", :dragon => {}
          assigns[:dragon].should equal(mock_dragon)
        end

        it "redirects to the dragon" do
          Dragon.stub(:find).and_return(mock_dragon({:id => 1}))
          mock_dragon.should_receive(:update_attributes).with({'these' => 'params'}).and_return(true)
          mock_dragon.should_receive(:attributes).and_return({'these' => 'params'})
          mock_dragon.should_receive(:father)
          mock_dragon.should_receive(:mother)
          mock_dragon.should_receive(:user)
          mock_dragon.should_receive(:activity)
          mock_dragon.should_receive(:breeder)
          put :update, :format => 'json', :id => "1", :dragon => {:these => 'params'}
          response.should be_success
        end
      end
    end
  end

  describe "DELETE destroy" do
    it "destroys the requested dragon" do
      Dragon.should_receive(:find).with("37").and_return(mock_dragon)
      mock_dragon.should_receive(:destroy)
      delete :destroy, :id => "37"
    end

    it "redirects to the dragons list" do
      Dragon.stub(:find).and_return(mock_dragon(:destroy => true))
      delete :destroy, :id => "1"
      response.should redirect_to(dragons_url)
    end
  end

end
