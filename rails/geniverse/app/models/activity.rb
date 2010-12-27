class Activity < ActiveRecord::Base
  has_many :dragons
end




# == Schema Information
#
# Table name: activities
#
#  id                      :integer         not null, primary key
#  initial_alleles         :string(255)
#  base_channel_name       :string(255)
#  max_users_in_room       :integer
#  send_bred_dragons       :boolean
#  created_at              :datetime
#  updated_at              :datetime
#  title                   :string(255)
#  hidden_genes            :string(255)
#  static_genes            :text
#  crossover_when_breeding :boolean         default(FALSE)
#  route                   :string(255)
#  pageType                :string(255)
#  message                 :text
#  match_dragon_alleles    :string(255)
#

