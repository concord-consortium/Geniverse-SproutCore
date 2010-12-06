# This file is auto-generated from the current state of the database. Instead of editing this file, 
# please use the migrations feature of Active Record to incrementally modify your database, and
# then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your database schema. If you need
# to create the application database on another system, you should be using db:schema:load, not running
# all the migrations from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended to check this file into your version control system.

ActiveRecord::Schema.define(:version => 20101206164245) do

  create_table "activities", :force => true do |t|
    t.string   "initial_alleles"
    t.string   "base_channel_name"
    t.integer  "max_users_in_room"
    t.boolean  "send_bred_dragons"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.string   "title"
    t.string   "sc_type"
    t.string   "hidden_genes"
    t.text     "static_genes"
  end

  create_table "dragons", :force => true do |t|
    t.string   "name"
    t.integer  "sex"
    t.string   "alleles"
    t.string   "imageURL"
    t.integer  "mother_id"
    t.integer  "father_id"
    t.boolean  "bred"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.integer  "user_id"
    t.integer  "stableOrder"
    t.boolean  "isEgg",           :default => false
    t.boolean  "isInMarketplace", :default => true
    t.integer  "activity_id"
  end

  add_index "dragons", ["activity_id"], :name => "index_dragons_on_activity_id"
  add_index "dragons", ["id"], :name => "index_dragons_on_id"
  add_index "dragons", ["user_id"], :name => "index_dragons_on_user_id"

  create_table "users", :force => true do |t|
    t.string   "username"
    t.string   "password_hash"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.integer  "group_id"
    t.integer  "member_id"
    t.string   "first_name"
    t.string   "last_name"
    t.text     "note"
  end

  add_index "users", ["username", "password_hash"], :name => "index_users_on_username_and_password_hash"

end
