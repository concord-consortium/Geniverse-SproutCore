Feature: Manage users
  In order to [goal]
  [stakeholder]
  wants [behaviour]
  
  Scenario: Register new user
    Given I am on the new user page
    When I fill in "Username" with "username 1"
    And I fill in "Password hash" with "password_hash 1"
    And I press "Create"
    Then I should see "username 1"
    And I should see "password_hash 1"

  Scenario: Delete user
    Given the following users:
      |username|password_hash|
      |username 1|password_hash 1|
      |username 2|password_hash 2|
      |username 3|password_hash 3|
      |username 4|password_hash 4|
    When I delete the 3rd user
    Then I should see the following users:
      |Username|Password hash|
      |username 1|password_hash 1|
      |username 2|password_hash 2|
      |username 4|password_hash 4|
