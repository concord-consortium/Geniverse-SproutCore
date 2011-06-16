class Case < ActiveRecord::Base
  has_many :activities, :foreign_key => :myCase_id, :order => "myCaseOrder ASC"

  def includeInJSon?(name)
    return [:activities].include?(name.to_sym)
  end
end
