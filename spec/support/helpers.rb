module Helpers
  def define_common_paths(app)
    app.define_path 'labPage', 'mainPage.mainPane.mainAppView', View
    app.define_path 'loginPage', 'loginController.panel.contentView', View
    app.define_path 'topBar', 'mainPage.mainPane.topBar', View

    app.define_path 'bottomBar', 'mainPage.mainPane.bottomBar', View

    app.define_framework 'Geniverse', 'Geniverse'

    app.define_path 'blogPostView', 'Geniverse.blogPostController.blogPostView'
  end

  def define_common_ivars(skip_login = true)
    @welcome_label = @app['topBar.welcomeLabelView', 'SC.LabelView']
    @logout_button = @app['topBar.logoutButton', 'SC.ImageView']

    unless skip_login
      @login_field = @app['loginPage.usernameView', 'SC.TextFieldView']
      @password_field = @app['loginPage.passwordView', 'SC.TextFieldView']
      @login_button = @app['loginPage.loginButtonView', 'SC.ButtonView']
      @login_prompt = @app['loginPage.welcomeView', 'SC.LabelView']
    end
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

  def match_organism_views(match_view)
    (return match_view.dragons_view.content_view.child_views) rescue NoMethodError
    return [match_view.dragon_view].compact  # in case of one-at-a-time matching
  end

  def get_matching_org_view(org_views, org, want_match)
    org_views.count.times do |i|
      puts "comparing:\n#{org_views[i].content['imageURL']}\n#{org.content['imageURL']}"
      if ((org_views[i].content['imageURL'] == org.content['imageURL']) == want_match)
        puts "matched expected: #{want_match}"
        return org_views[i]
      end
    end
    return nil
  end

  def hide_info_pane
    @app['infoController', 'SC.ObjectController'].pane.content_view.hide_button.click
  end

  def get_female_from_challenge_pool(challenge_pool_view)
    organism_views = challenge_pool_view.dragons_view.content_view.child_views
    organism_views.count.times do |i|
      org_view = organism_views[i]
      return org_view if org_view.content['sex'] == 1
    end
    return nil
  end

  def get_male_from_challenge_pool(challenge_pool_view)
    organism_views = challenge_pool_view.dragons_view.content_view.child_views
    organism_views.count.times do |i|
      org_view = organism_views[i]
      return org_view if org_view.content['sex'] == 0
    end
    return nil
  end

  # button_titles can either be a string or an array of strings
  def verify_alert(type, button_titles, msg = nil)
    # should pop up an SC.AlertPane
    @app.responding_panes.count.should eq(3), "There should be 3 responding panes."

    pane = @app.key_pane Lebowski::Foundation::Panes::AlertPane
    pane.should_not be_nil, "pane should exist"
    begin
      pane.type.should eq(type), "pane should be #{type.to_s}. is: #{pane.type.to_s}"

      if (button_titles.kind_of? Array)
        pane.button_count.should eq(button_titles.length), "pane should have #{button_titles.length} buttons."
        button_titles.each do |title|
          pane.has_button?(title).should be_true, "pane should have #{title} button."
        end
      else
        pane.button_count.should eq(1), "pane should only have 1 button."
        pane.has_button?(button_titles).should be_true, "pane should have #{button_titles} button."
      end

      pane.description.should eq(msg) if msg
    ensure
      if (button_titles.kind_of? Array)
        pane.click_button button_titles[0]
      else
        pane.click_button button_titles
      end
    end
  end

end
