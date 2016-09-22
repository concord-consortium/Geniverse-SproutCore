class User < ActiveRecord::Base
  attr_protected :id
  validates_uniqueness_of(:username)

  serialize :metadata
end



# == Schema Information
#
# Table name: users
#
#  id            :integer         not null, primary key
#  username      :string(255)
#  password_hash :string(255)
#  created_at    :datetime
#  updated_at    :datetime
#  group_id      :integer
#  member_id     :integer
#  first_name    :string(255)
#  last_name     :string(255)
#  note          :text
#  class_name    :string(255)
#  metadata      :text
#
