class UnlockablesController < ApplicationController
  # GET /unlockables
  # GET /unlockables.json
  def index
    @unlockables = Unlockable.all

    respond_to do |format|
      format.html # index.html.erb
      format.xml  { render :xml => @unlockables }
      format.json { render :json => custom_array_hash(@unlockables) }
    end
  end

  # GET /unlockables/1
  # GET /unlockables/1.json
  def show
    @unlockable = Unlockable.find(params[:id])

    respond_to do |format|
      format.html # show.html.erb
      format.xml  { render :xml => @unlockable }
      format.json { render :json => custom_item_hash(@unlockable) }
    end
  end

  # GET /unlockables/new
  # GET /unlockables/new.json
  def new
    @unlockable = Unlockable.new

    respond_to do |format|
      format.html # new.html.erb
      format.json { render :json => @unlockable }
    end
  end

  # GET /unlockables/1/edit
  def edit
    @unlockable = Unlockable.find(params[:id])
  end

  # POST /unlockables
  # POST /unlockables.json
  def create
    @unlockable = Unlockable.new(params[:unlockable])

    respond_to do |format|
      if @unlockable.save
        flash[:notice] = 'Unlockable was successfully created.'
        format.html { redirect_to @unlockable }
        format.json { render :json => custom_item_hash(@unlockable), :status => :created, :location => @unlockable }
      else
        format.html { render :action => "new" }
        format.json { render :json => @unlockable.errors, :status => :unprocessable_entity }
      end
    end
  end

  # PUT /unlockables/1
  # PUT /unlockables/1.json
  def update
    @unlockable = Unlockable.find(params[:id])

    respond_to do |format|
      if @unlockable.update_attributes(params[:unlockable])
        flash[:notice] = 'Unlockable was successfully updated.'
        format.html { redirect_to @unlockable }
        format.json { head :no_content }
      else
        format.html { render :action => "edit" }
        format.json { render :json => @unlockable.errors, :status => :unprocessable_entity }
      end
    end
  end

  # DELETE /unlockables/1
  # DELETE /unlockables/1.json
  def destroy
    @unlockable = Unlockable.find(params[:id])
    @unlockable.destroy

    respond_to do |format|
      format.html { redirect_to unlockables_url }
      format.json { head :no_content }
    end
  end
end
