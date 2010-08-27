Given /^the following activities:$/ do |activities|
  Activity.create!(activities.hashes)
end

When /^I delete the (\d+)(?:st|nd|rd|th) activity$/ do |pos|
  visit activities_path
  within("table tr:nth-child(#{pos.to_i+1})") do
    click_link "Destroy"
  end
end

Then /^I should see the following activities:$/ do |expected_activities_table|
  expected_activities_table.diff!(tableish('table tr', 'td,th'))
end
