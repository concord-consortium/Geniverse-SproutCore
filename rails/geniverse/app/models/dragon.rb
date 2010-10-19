class Dragon < ActiveRecord::Base
  has_many :children, :class_name => "Dragon", :finder_sql => 'SELECT * FROM dragons WHERE mother_id = #{id} OR father_id = #{id}'
  
  belongs_to :father, :class_name => "Dragon"
  belongs_to :mother, :class_name => "Dragon"
  
  belongs_to :activity
  
  belongs_to :user
  
  def self.searchFields
    return {
      :user_id => /^(\d+|null)$/,
      :activity_id => /^(\d+|null)$/,
      :mother_id => /^(\d+|null)$/,
      :father_id => /^(\d+|null)$/,
      :isInMarketplace => /^(true|false)$/,
      :bred => /^(true|false)$/,
      :isEgg => /^(true|false)$/
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

