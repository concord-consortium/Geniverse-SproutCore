namespace :app do
  desc "Setup the default geniverse 'cases'"
  task :setup => :environment do
    cases = []
    cases << {:title => "Apprentice Heredity Intro", :sc_type => "Apprentice/Heredity/Intro", :initial_alleles => "[{m: 'a:f,b:f', f: 'a:F,b:F'}, {m: 'a:W,b:W', f: 'a:w,b:w'}]", :send_bred_dragons => true, :base_channel_name => "apprenticeHeredityIntro", :max_users_in_room => 10}
    cases << {:title => "Apprentice Heredity Individual", :sc_type => "Apprentice/Heredity/Individual", :initial_alleles => "[{m: 'a:f,b:f', f: 'a:F,b:F'}, {m: 'a:W,b:W', f: 'a:w,b:w'}]", :send_bred_dragons => true, :base_channel_name => "apprenticeHeredityIndividual", :max_users_in_room => 10}
    cases << {:title => "Apprentice Heredity Group", :sc_type => "Apprentice/Heredity/Group", :initial_alleles => "[{m: 'a:f,b:f', f: 'a:F,b:F'}, {m: 'a:W,b:W', f: 'a:w,b:w'}]", :send_bred_dragons => true, :base_channel_name => "apprenticeHeredityGroup", :max_users_in_room => 10}
    
    cases.each do |c|
      a = Activity.find_by_title_and_sc_type(c[:title], c[:sc_type])
      if (a.nil?)
        puts "Creating new activity: #{c[:title]}"
        Activity.create!(c)
      else
        puts "Updating attributes of existing activity: #{c[:title]}"
        a.update_attributes!(c)
      end
    end
  end  
end