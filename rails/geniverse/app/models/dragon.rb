class Dragon < ActiveRecord::Base
  has_many :children, :class_name => "Dragon", :finder_sql => 'SELECT * FROM dragons WHERE mother_id = #{id} OR father_id = #{id}'
  has_many :siblings, :class_name => "Dragon", :finder_sql => 'SELECT * FROM dragons WHERE (mother_id = #{mother_id} OR father_id = #{father_id}) AND breeder_id = #{breeder_id} AND breedTime = #{breedTime} AND id != #{id}'
  
  belongs_to :father, :class_name => "Dragon"
  belongs_to :mother, :class_name => "Dragon"
  
  belongs_to :activity
  
  belongs_to :user
  belongs_to :breeder, :class_name => "User", :foreign_key => "breeder_id"
  
  def self.searchFields
    return {
      :user_id => /^(\d+|null)$/,
      :breeder_id => /^(\d+|null)$/,
      :activity_id => /^(\d+|null)$/,
      :mother_id => /^(\d+|null)$/,
      :father_id => /^(\d+|null)$/,
      :isInMarketplace => /^(true|false)$/,
      :bred => /^(true|false)$/,
      :isEgg => /^(true|false)$/,
      :breedTime => /^(\d+|null)$/
    }
  end

  def self.search(params)
    if params
      conditions = {}
      searchfields = self.searchFields
      params.each_pair do |k,v|
        match = (searchfields[k.to_sym] && v.to_s =~ searchfields[k.to_sym])
        if (match)
          value = case v.to_s
            when /^true$/i then true
            when /^false$/i then false
            when /^null$/i then nil
            when /^nil$/i then nil
            else v.to_s
          end
          conditions[k.to_sym] = value
        end
      end
      return find(:all, :conditions => conditions)
    else
      return find(:all)
    end
  end

end

# == Schema Information
#
# Table name: dragons
#
#    create_table "dragons", :force => true do |t|
    #t.string   "name"
    #t.integer  "sex"
    #t.string   "alleles"
    #t.string   "imageURL"
    #t.integer  "mother_id"
    #t.integer  "father_id"
    #t.boolean  "bred"
    #t.datetime "created_at"
    #t.datetime "updated_at"
    #t.integer  "user_id"
    #t.integer  "stableOrder"
    #t.boolean  "isEgg",           :default => false
    #t.boolean  "isInMarketplace", :default => true
    #t.integer  "activity_id"
  #end#



# == Schema Information
#
# Table name: dragons
#
#  id              :integer         not null, primary key
#  name            :string(255)
#  sex             :integer
#  alleles         :string(255)
#  imageURL        :string(255)
#  mother_id       :integer
#  father_id       :integer
#  bred            :boolean
#  created_at      :datetime
#  updated_at      :datetime
#  user_id         :integer
#  stableOrder     :integer
#  isEgg           :boolean         default(FALSE)
#  isInMarketplace :boolean         default(TRUE)
#  activity_id     :integer
#  breeder_id      :integer
#  breedTime       :integer
#

