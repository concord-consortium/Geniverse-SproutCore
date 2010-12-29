require 'spec_helper'

describe HelpMessagesController do

  def mock_help_message(stubs={})
    @mock_help_message ||= mock_model(HelpMessage, stubs)
  end

  describe "GET index" do
    it "assigns all help_messages as @help_messages" do
      HelpMessage.stub(:find).with(:all).and_return([mock_help_message])
      get :index
      assigns[:help_messages].should == [mock_help_message]
    end
  end

  describe "GET show" do
    it "assigns the requested help_message as @help_message" do
      HelpMessage.stub(:find).with("37").and_return(mock_help_message)
      get :show, :id => "37"
      assigns[:help_message].should equal(mock_help_message)
    end
  end

  describe "GET new" do
    it "assigns a new help_message as @help_message" do
      HelpMessage.stub(:new).and_return(mock_help_message)
      get :new
      assigns[:help_message].should equal(mock_help_message)
    end
  end

  describe "GET edit" do
    it "assigns the requested help_message as @help_message" do
      HelpMessage.stub(:find).with("37").and_return(mock_help_message)
      get :edit, :id => "37"
      assigns[:help_message].should equal(mock_help_message)
    end
  end

  describe "POST create" do

    describe "with valid params" do
      it "assigns a newly created help_message as @help_message" do
        HelpMessage.stub(:new).with({'these' => 'params'}).and_return(mock_help_message(:save => true))
        post :create, :help_message => {:these => 'params'}
        assigns[:help_message].should equal(mock_help_message)
      end

      it "redirects to the created help_message" do
        HelpMessage.stub(:new).and_return(mock_help_message(:save => true))
        post :create, :help_message => {}
        response.should redirect_to(help_message_url(mock_help_message))
      end
    end

    describe "with invalid params" do
      it "assigns a newly created but unsaved help_message as @help_message" do
        HelpMessage.stub(:new).with({'these' => 'params'}).and_return(mock_help_message(:save => false))
        post :create, :help_message => {:these => 'params'}
        assigns[:help_message].should equal(mock_help_message)
      end

      it "re-renders the 'new' template" do
        HelpMessage.stub(:new).and_return(mock_help_message(:save => false))
        post :create, :help_message => {}
        response.should render_template('new')
      end
    end

  end

  describe "PUT update" do

    describe "with valid params" do
      it "updates the requested help_message" do
        HelpMessage.should_receive(:find).with("37").and_return(mock_help_message)
        mock_help_message.should_receive(:update_attributes).with({'these' => 'params'})
        put :update, :id => "37", :help_message => {:these => 'params'}
      end

      it "assigns the requested help_message as @help_message" do
        HelpMessage.stub(:find).and_return(mock_help_message(:update_attributes => true))
        put :update, :id => "1"
        assigns[:help_message].should equal(mock_help_message)
      end

      it "redirects to the help_message" do
        HelpMessage.stub(:find).and_return(mock_help_message(:update_attributes => true))
        put :update, :id => "1"
        response.should redirect_to(help_message_url(mock_help_message))
      end
    end

    describe "with invalid params" do
      it "updates the requested help_message" do
        HelpMessage.should_receive(:find).with("37").and_return(mock_help_message)
        mock_help_message.should_receive(:update_attributes).with({'these' => 'params'})
        put :update, :id => "37", :help_message => {:these => 'params'}
      end

      it "assigns the help_message as @help_message" do
        HelpMessage.stub(:find).and_return(mock_help_message(:update_attributes => false))
        put :update, :id => "1"
        assigns[:help_message].should equal(mock_help_message)
      end

      it "re-renders the 'edit' template" do
        HelpMessage.stub(:find).and_return(mock_help_message(:update_attributes => false))
        put :update, :id => "1"
        response.should render_template('edit')
      end
    end

  end

  describe "DELETE destroy" do
    it "destroys the requested help_message" do
      HelpMessage.should_receive(:find).with("37").and_return(mock_help_message)
      mock_help_message.should_receive(:destroy)
      delete :destroy, :id => "37"
    end

    it "redirects to the help_messages list" do
      HelpMessage.stub(:find).and_return(mock_help_message(:destroy => true))
      delete :destroy, :id => "1"
      response.should redirect_to(help_messages_url)
    end
  end

end
