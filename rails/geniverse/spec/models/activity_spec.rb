require 'spec_helper'

describe Activity do
  before(:each) do
    @valid_attributes = {
      :title => "value for title",
      :initial_alleles => "value for initial_alleles",
      :base_channel_name => "value for base_channel_name",
      :max_users_in_room => 1,
      :send_bred_dragons => false,
      :hidden_genes => "value for hidden_genes",
      :static_genes => "value for static_genes",
      :crossover_when_breeding => false,
      :route => "/value/for/route",
      :pageType => "value for pageType",
      :message => "value for message",
      :match_dragon_alleles => "value for match_dragon_alleles"
    }
  end

  it "should create a new instance given valid attributes" do
    Activity.create!(@valid_attributes)
  end
end


#  create_table "activities", :force => true do |t|
#    t.string   "initial_alleles"
#    t.string   "base_channel_name"
#    t.integer  "max_users_in_room"
#    t.boolean  "send_bred_dragons"
#    t.datetime "created_at"
#    t.datetime "updated_at"
#    t.string   "title"
#    t.string   "hidden_genes"
#    t.text     "static_genes"
#    t.boolean  "crossover_when_breeding", :default => false
#    t.string   "route"
#    t.string   "pageType"
#    t.text     "message"
#    t.string   "match_dragon_alleles"
#  end

