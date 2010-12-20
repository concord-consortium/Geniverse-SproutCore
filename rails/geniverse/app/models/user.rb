class User < ActiveRecord::Base
  validates_uniqueness_of(:username)
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
#

