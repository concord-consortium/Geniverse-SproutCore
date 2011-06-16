class Case < ActiveRecord::Base
  has_many :activities, :foreign_key => :myCase_id, :order => "myCaseOrder ASC"
end
