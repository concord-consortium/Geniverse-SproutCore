class HelpMessagesController < ApplicationController
  # GET /help_messages
  # GET /help_messages.xml
  def index
    @help_messages = HelpMessage.all

    respond_to do |format|
      format.html # index.html.erb
      format.xml  { render :xml => @help_messages }
      format.json #{ render :json => custom_array_hash(@help_messages) }
    end
  end

  # GET /help_messages/1
  # GET /help_messages/1.xml
  def show
    @help_message = HelpMessage.find(params[:id])

    respond_to do |format|
      format.html # show.html.erb
      format.xml  { render :xml => @help_message }
      format.json #{ render :json => custom_item_hash(@help_message) }
    end
  end

  # GET /help_messages/new
  # GET /help_messages/new.xml
  def new
    @help_message = HelpMessage.new

    respond_to do |format|
      format.html # new.html.erb
      format.xml  { render :xml => @help_message }
    end
  end

  # GET /help_messages/1/edit
  def edit
    @help_message = HelpMessage.find(params[:id])
  end

  # POST /help_messages
  # POST /help_messages.xml
  def create
    @help_message = HelpMessage.new(params[:help_message])

    respond_to do |format|
      if @help_message.save
        format.html { redirect_to(@help_message, :notice => 'HelpMessage was successfully created.') }
        format.xml  { render :xml => @help_message, :status => :created, :location => @help_message }
      else
        format.html { render :action => "new" }
        format.xml  { render :xml => @help_message.errors, :status => :unprocessable_entity }
      end
    end
  end

  # PUT /help_messages/1
  # PUT /help_messages/1.xml
  def update
    @help_message = HelpMessage.find(params[:id])

    respond_to do |format|
      if @help_message.update_attributes(params[:help_message])
        format.html { redirect_to(@help_message, :notice => 'HelpMessage was successfully updated.') }
        format.xml  { head :ok }
      else
        format.html { render :action => "edit" }
        format.xml  { render :xml => @help_message.errors, :status => :unprocessable_entity }
      end
    end
  end

  # DELETE /help_messages/1
  # DELETE /help_messages/1.xml
  def destroy
    @help_message = HelpMessage.find(params[:id])
    @help_message.destroy

    respond_to do |format|
      format.html { redirect_to(help_messages_url) }
      format.xml  { head :ok }
    end
  end
end
