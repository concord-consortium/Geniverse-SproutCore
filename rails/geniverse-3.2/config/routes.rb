Geniverse32::Application.routes.draw do
  # The priority is based upon order of creation:
  # first created -> highest priority.

  # Sample of regular route:
  #   match 'products/:id' => 'catalog#view'
  # Keep in mind you can assign values other than :controller and :action

  # Sample of named route:
  #   match 'products/:id/purchase' => 'catalog#purchase', :as => :purchase
  # This route can be invoked with purchase_url(:id => product.id)

  # Sample resource route (maps HTTP verbs to controller actions automatically):
  #   resources :products

  # Sample resource route with options:
  #   resources :products do
  #     member do
  #       get 'short'
  #       post 'toggle'
  #     end
  #
  #     collection do
  #       get 'sold'
  #     end
  #   end

  # Sample resource route with sub-resources:
  #   resources :products do
  #     resources :comments, :sales
  #     resource :seller
  #   end

  # Sample resource route with more complex sub-resources
  #   resources :products do
  #     resources :comments
  #     resources :sales do
  #       get 'recent', :on => :collection
  #     end
  #   end

  # Sample resource route within a namespace:
  #   namespace :admin do
  #     # Directs /admin/products/* to Admin::ProductsController
  #     # (app/controllers/admin/products_controller.rb)
  #     resources :products
  #   end

  # You can have the root of your site routed with "root"
  # just remember to delete public/index.html.
  # root :to => 'welcome#index'

  # See how all your routes lay out with "rake routes"

  # This is a legacy wild controller route that's not recommended for RESTful applications.
  # Note: This route will make all actions in every controller accessible via GET requests.
  # match ':controller(/:action(/:id))(.:format)'

  resources :help_messages, :articles, :cases, :activities, :dragons

  get 'destroy_all_dragons' => 'dragons#destroy_all'
  get 'fathom/:id/:id2' => 'dragons#fathom', :defaults => {:format => 'html', :id => '-1', :id2 => '-1'}
  get 'breedingRecords/:id/:id2' => 'dragons#breedingRecords', :defaults => {:format => 'html', :id => '-1', :id2 => '-1'}
  get 'breedingRecordsShow/:id' => 'dragons#breedingRecordsShow', :defaults => {:format => 'html'}

  # map username first, so usernames don't fall through and get interpreted as ids
  # usernames must start with an alpha character, but can have numbers or letters after that
  get 'users/:username' => "users#show", :constraints => { :username => /[a-z][a-z0-9]*/i }, :defaults => {:format => 'json'}

  resources :users, :except => :new

  # fallback
  match ':controller(/:action(/:id(/:id2)))(.:format)'
end
