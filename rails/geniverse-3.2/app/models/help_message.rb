class HelpMessage < ActiveRecord::Base
  attr_protected :id
end

# == Schema Information
#
# Table name: help_messages
#
#  id         :integer         not null, primary key
#  page_name  :string(255)
#  message    :text
#  created_at :datetime
#  updated_at :datetime
#

