class ArticlesController < ApplicationController
  # GET /articles
  # GET /articles.xml
  def index
    @articles = Article.all

    respond_to do |format|
      format.html # index.html.erb
      format.xml  { render :xml => @articles }
      format.json { render :json => custom_array_hash(@articles) }
    end
  end

  # GET /articles/1
  # GET /articles/1.xml
  def show
    @article = Article.find(params[:id])

    respond_to do |format|
      format.html # show.html.erb
      format.xml  { render :xml => @article }
      format.json { render :json => custom_item_hash(@articles) }
    end
  end

  # GET /articles/new
  # GET /articles/new.xml
  def new
    @article = Article.new

    respond_to do |format|
      format.html # new.html.erb
      format.xml  { render :xml => @article }
    end
  end

  # GET /articles/1/edit
  def edit
    @article = Article.find(params[:id])
  end

  # POST /articles
  # POST /articles.xml
  def create
    article = params[:article]
    article.delete(:guid)

    Article.reflect_on_all_associations(:belongs_to).each do |assoc|
      name = assoc.name
      attr_key = assoc.options[:foreign_key] || (name.to_s + "_id")
      article[attr_key.to_sym] = article[name.to_sym].sub(/.*\//,'') if article[name.to_sym]
      article.delete(name.to_sym)
    end
    @article = Article.new(article)

    respond_to do |format|
      if @article.save
        format.html { redirect_to(@article, :notice => 'Article was successfully created.') }
        format.xml  { render :xml => @article, :status => :created, :location => @article }
        format.json { render :json => custom_item_hash(@article), :status => :created, :location => @article }
      else
        format.html { render :action => "new" }
        format.xml  { render :xml => @article.errors, :status => :unprocessable_entity }
      end
    end
  end

  # PUT /articles/1
  # PUT /articles/1.xml
  def update
    @article = Article.find(params[:id])
    article = params[:article]
    article.delete(:guid)
    Article.reflect_on_all_associations(:belongs_to).each do |assoc|
      name = assoc.name
      attr_key = assoc.options[:foreign_key] || (name.to_s + "_id")
      article[attr_key.to_sym] = article[name.to_sym].sub(/.*\//,'') if article[name.to_sym]
      article.delete(name.to_sym)
    end
    respond_to do |format|
      if @article.update_attributes(article)
        format.html { redirect_to(@article, :notice => 'Article was successfully updated.') }
        format.xml  { head :ok }
        format.json { render :json => custom_item_hash(@article), :status => :ok, :location => @article }
      else
        format.html { render :action => "edit" }
        format.xml  { render :xml => @article.errors, :status => :unprocessable_entity }
        format.json { render :json => @article.errors, :status => :unprocessable_entity }
      end
    end
  end

  # DELETE /articles/1
  # DELETE /articles/1.xml
  def destroy
    @article = Article.find(params[:id])
    @article.destroy

    respond_to do |format|
      format.html { redirect_to(articles_url) }
      format.xml  { head :ok }
    end
  end
end
