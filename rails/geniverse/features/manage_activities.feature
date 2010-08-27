Feature: Manage activities
  In order to [goal]
  [stakeholder]
  wants [behaviour]
  
  Scenario: Register new activity
    Given I am on the new activity page
    When I fill in "Title" with "title 1"
    And I fill in "Initial alleles" with "initial_alleles 1"
    And I fill in "Base channel name" with "base_channel_name 1"
    And I fill in "Max users in room" with "max_users_in_room 1"
    And I uncheck "Send bred dragons"
    And I fill in "Sc type" with "sc_type 1"
    And I press "Create"
    Then I should see "title 1"
    And I should see "initial_alleles 1"
    And I should see "base_channel_name 1"
    And I should see "max_users_in_room 1"
    And I should see "false"
    And I should see "sc_type 1"

  Scenario: Delete activity
    Given the following activities:
      |title|initial_alleles|base_channel_name|max_users_in_room|send_bred_dragons|sc_type|
      |title 1|initial_alleles 1|base_channel_name 1|max_users_in_room 1|false|sc_type 1|
      |title 2|initial_alleles 2|base_channel_name 2|max_users_in_room 2|true|sc_type 2|
      |title 3|initial_alleles 3|base_channel_name 3|max_users_in_room 3|false|sc_type 3|
      |title 4|initial_alleles 4|base_channel_name 4|max_users_in_room 4|true|sc_type 4|
    When I delete the 3rd activity
    Then I should see the following activities:
      |Title|Initial alleles|Base channel name|Max users in room|Send bred dragons|Sc type|
      |title 1|initial_alleles 1|base_channel_name 1|max_users_in_room 1|false|sc_type 1|
      |title 2|initial_alleles 2|base_channel_name 2|max_users_in_room 2|true|sc_type 2|
      |title 4|initial_alleles 4|base_channel_name 4|max_users_in_room 4|true|sc_type 4|
