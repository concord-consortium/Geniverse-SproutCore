ActionController::Routing::Routes.draw do |map|
  map.resources :unlockables

  map.resources :help_messages

  map.resources :articles

  map.resources :dragons
  map.connect "destroy_all_dragons", :controller => 'dragons', :action => 'destroy_all'
  map.connect "fathom/:id/:id2", :format => 'html', :controller => 'dragons', :action => 'fathom', :id => '-1', :id2 => '-1'
  map.connect "breedingRecords/:id/:id2", :format => 'html', :controller => 'dragons', :action => 'breedingRecords', :id => '-1', :id2 => '-1'
  map.connect "breedingRecordsShow/:id", :format => 'html', :controller => 'dragons', :action => 'breedingRecordsShow'

  # map username first, so usernames don't fall through and get interpreted as ids
  map.connect "users/:username", :format => 'json', :controller => 'users', :action => 'show',
    :requirements => { :username => /[a-z][a-z0-9]*/i } # usernames must start with an alpha character, but can have numbers or letters after that
  map.resources :users, :except => :new
  map.connect "starsReport/:id", :controller => 'users', :action => 'starsReport'

  map.resources :activities

  map.resources :cases

  # The priority is based upon order of creation: first created -> highest priority.

  # Sample of regular route:
  #   map.connect 'products/:id', :controller => 'catalog', :action => 'view'
  # Keep in mind you can assign values other than :controller and :action

  # Sample of named route:
  #   map.purchase 'products/:id/purchase', :controller => 'catalog', :action => 'purchase'
  # This route can be invoked with purchase_url(:id => product.id)

  # Sample resource route (maps HTTP verbs to controller actions automatically):
  #   map.resources :products

  # Sample resource route with options:
  #   map.resources :products, :member => { :short => :get, :toggle => :post }, :collection => { :sold => :get }

  # Sample resource route with sub-resources:
  #   map.resources :products, :has_many => [ :comments, :sales ], :has_one => :seller

  # Sample resource route with more complex sub-resources
  #   map.resources :products do |products|
  #     products.resources :comments
  #     products.resources :sales, :collection => { :recent => :get }
  #   end

  # Sample resource route within a namespace:
  #   map.namespace :admin do |admin|
  #     # Directs /admin/products/* to Admin::ProductsController (app/controllers/admin/products_controller.rb)
  #     admin.resources :products
  #   end

  # You can have the root of your site routed with map.root -- just remember to delete public/index.html.
  # map.root :controller => "welcome"

  # See how all your routes lay out with "rake routes"

  # Install the default routes as the lowest priority.
  # Note: These default routes make all actions in every controller accessible via GET requests. You should
  # consider removing or commenting them out if you're using named routes and resources.
  map.connect ':controller/:action/:id'
  map.connect ':controller/:action/:id.:format'
  map.connect ':controller/:action/:id/:id2'
end
