class Dragon < ActiveRecord::Base
  has_many :children, :class_name => "Dragon", :finder_sql => 'SELECT * FROM dragons WHERE mother_id = #{id} OR father_id = #{id}'
  
  belongs_to :father, :class_name => "Dragon"
  belongs_to :mother, :class_name => "Dragon"
  
  belongs_to :activity
  
  belongs_to :user
end

# == Schema Information
#
# Table name: dragons
#
#  id         :integer         not null, primary key
#  name       :string(255)
#  sex        :integer
#  alleles    :string(255)
#  imageURL   :string(255)
#  mother_id  :integer
#  father_id  :integer
#  bred       :boolean
#  created_at :datetime
#  updated_at :datetime
#  user_id    :integer
#

