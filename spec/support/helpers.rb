module Helpers
  def define_common_paths(app)
    app.define_path 'labPage', 'mainPage.mainPane.mainAppView', View
    app.define_path 'loginPage', 'loginController.panel.contentView', View
    app.define_path 'topBar', 'mainPage.mainPane.topBar', View

    app.define_framework 'Geniverse', 'Geniverse'
  end

  def define_common_ivars
    @welcome_label = @app['topBar.welcomeLabelView', 'SC.LabelView']
    @logout_button = @app['topBar.logoutButton', 'SC.ImageView']
    
    @login_field = @app['loginPage.usernameView', 'SC.TextFieldView']
    @password_field = @app['loginPage.passwordView', 'SC.TextFieldView']
    @login_button = @app['loginPage.loginButtonView', 'SC.ButtonView']
    @login_prompt = @app['loginPage.welcomeView', 'SC.LabelView']
  end

  def login(username="student", password="password", initial_message="please log in")
    @login_field.type username
    @password_field.type password
    @login_button.click
    
    if @welcome_label.value == "" || @welcome_label.value == initial_message
      waittime = 11 #seconds
      p "Waiting up to " + waittime.to_s + " seconds for @welcome_label.value to be set."
      start = Time.now
      until (@welcome_label.value != "" && @welcome_label.value != initial_message) do
        sleep 1
        p " @welcome_label.value: " + @welcome_label.value.to_s
        elapsed = Time.now - start
        p " " + elapsed.to_s + " seconds have passed."
        break if (elapsed >= waittime)
      end
    end
    p "@welcome_label.value is now: " + @welcome_label.value.to_s
  end

  def logout
    @logout_button.click

    # This exists in gem version of Lebowski at least since 11/22/10
    @app.reset_application_context
  end

  def stable_organism_views(stable_view)
    stable_view.stable.content_view.child_views
  end

  def breeding_pen_organism_views(breeding_pen_view)
    breeding_pen_view.pen_view.content_view.child_views
  end
end
