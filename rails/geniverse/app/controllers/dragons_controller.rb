class DragonsController < ApplicationController
  # GET /dragons
  # GET /dragons.xml
  def index
    @dragons = Dragon.search(params)    
    respond_to do |format|
      format.html # index.html.erb
      format.xml  { render :xml => @dragons }
      format.json { render :json => custom_array_hash(@dragons) }
    end
  end
  
  # GET /dragons/fathom
  def fathom
    @user = User.find(params[:id]) unless (params[:id] == "-1")
    @activity = Activity.find(params[:id2]) unless (params[:id2] == "-1")
    
    if (@activity && @user)
      @dragons = Dragon.find(:all, :conditions => ['user_id = ? AND activity_id = ?', @user, @activity])
    elsif (@user)
      @dragons = Dragon.find(:all, :conditions => ['user_id = ?', @user])
    else
      @dragons = Dragon.find(:all)
    end
    
    respond_to do |format|
      format.html { render :fathom => @dragons }
    end
  end

  # GET /dragons/1
  # GET /dragons/1.xml
  def show
    @dragon = Dragon.find(params[:id])

    respond_to do |format|
      format.html # show.html.erb
      format.xml  { render :xml => @dragon }
      format.json { render :json => custom_item_hash(@dragon) }
    end
  end

  # GET /dragons/new
  # GET /dragons/new.xml
  def new
    @dragon = Dragon.new

    respond_to do |format|
      format.html # new.html.erb
      format.xml  { render :xml => @dragon }
    end
  end

  # GET /dragons/1/edit
  def edit
    @dragon = Dragon.find(params[:id])
  end

  # POST /dragons
  # POST /dragons.xml
  def create
    dragon = params[:dragon]
    dragon.delete(:guid)
    # mother and father attributes get sent from sproutcore in the form /rails/dragons/NN
    Dragon.reflect_on_all_associations(:belongs_to).each do |assoc|
      name = assoc.name
      attr_key = assoc.options[:foreign_key] || (name.to_s + "_id")
      dragon[attr_key.to_sym] = dragon[name.to_sym].sub(/.*\//,'') if dragon[name.to_sym]
      dragon.delete(name.to_sym)
    end
    @dragon = Dragon.new(dragon)

    respond_to do |format|
      if @dragon.save
        format.html { redirect_to(@dragon, :notice => 'Dragon was successfully created.') }
        format.xml  { render :xml => @dragon, :status => :created, :location => @dragon }
        format.json { render :json => custom_item_hash(@dragon), :status => :created, :location => @dragon }
      else
        format.html { render :action => "new" }
        format.xml  { render :xml => @dragon.errors, :status => :unprocessable_entity }
      end
    end
  end

  # PUT /dragons/1
  # PUT /dragons/1.xml
  def update
    @dragon = Dragon.find(params[:id])
    dragon = params[:dragon]
    dragon.delete(:guid)
    Dragon.reflect_on_all_associations(:belongs_to).each do |assoc|
      name = assoc.name
      attr_key = assoc.options[:foreign_key] || (name.to_s + "_id")
      dragon[attr_key.to_sym] = dragon[name.to_sym].sub(/.*\//,'') if dragon[name.to_sym]
      dragon.delete(name.to_sym)
    end
    respond_to do |format|
      if @dragon.update_attributes(dragon)
        format.html { redirect_to(@dragon, :notice => 'Dragon was successfully updated.') }
        format.xml  { head :ok }
        format.json { render :json => custom_item_hash(@dragon), :status => :ok, :location => @dragon }
      else
        format.html { render :action => "edit" }
        format.xml  { render :xml => @dragon.errors, :status => :unprocessable_entity }
        format.json { render :json => @dragon.errors, :status => :unprocessable_entity }
      end
    end
  end

  # DELETE /dragons/1
  # DELETE /dragons/1.xml
  def destroy
    @dragon = Dragon.find(params[:id])
    @dragon.destroy

    respond_to do |format|
      format.html { redirect_to(dragons_url) }
      format.xml  { head :ok }
    end
  end
  
  def destroy_all
    Dragon.destroy_all
    redirect_to(dragons_url)
  end

end
