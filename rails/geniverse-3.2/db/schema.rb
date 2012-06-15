# encoding: UTF-8
# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended to check this file into your version control system.

ActiveRecord::Schema.define(:version => 20120109215041) do

  create_table "activities", :force => true do |t|
    t.string   "initial_alleles"
    t.string   "base_channel_name"
    t.integer  "max_users_in_room"
    t.boolean  "send_bred_dragons"
    t.datetime "created_at",                                    :null => false
    t.datetime "updated_at",                                    :null => false
    t.string   "title"
    t.string   "hidden_genes"
    t.text     "static_genes"
    t.boolean  "crossover_when_breeding",    :default => false
    t.string   "route"
    t.string   "pageType"
    t.text     "message"
    t.string   "match_dragon_alleles"
    t.integer  "myCase_id"
    t.integer  "myCaseOrder"
    t.boolean  "is_argumentation_challenge", :default => false
    t.integer  "threshold_three_stars"
    t.integer  "threshold_two_stars"
  end

  create_table "articles", :force => true do |t|
    t.integer  "group"
    t.integer  "activity_id"
    t.text     "text"
    t.integer  "time"
    t.boolean  "submitted"
    t.text     "teacherComment"
    t.boolean  "accepted"
    t.datetime "created_at",     :null => false
    t.datetime "updated_at",     :null => false
  end

  create_table "cases", :force => true do |t|
    t.string   "name"
    t.integer  "order"
    t.datetime "created_at",    :null => false
    t.datetime "updated_at",    :null => false
    t.string   "introImageUrl"
  end

  create_table "dragons", :force => true do |t|
    t.string   "name"
    t.integer  "sex"
    t.string   "alleles"
    t.string   "imageURL"
    t.integer  "mother_id"
    t.integer  "father_id"
    t.boolean  "bred"
    t.datetime "created_at",                                       :null => false
    t.datetime "updated_at",                                       :null => false
    t.integer  "user_id"
    t.integer  "stableOrder"
    t.boolean  "isEgg",                         :default => false
    t.boolean  "isInMarketplace",               :default => true
    t.integer  "activity_id"
    t.integer  "breeder_id"
    t.string   "breedTime",       :limit => 16
    t.boolean  "isMatchDragon",                 :default => false
  end

  add_index "dragons", ["activity_id"], :name => "index_dragons_on_activity_id"
  add_index "dragons", ["id"], :name => "index_dragons_on_id"
  add_index "dragons", ["mother_id", "father_id", "breeder_id", "breedTime", "id"], :name => "breed_record_index"
  add_index "dragons", ["user_id"], :name => "index_dragons_on_user_id"

  create_table "help_messages", :force => true do |t|
    t.string   "page_name"
    t.text     "message"
    t.datetime "created_at", :null => false
    t.datetime "updated_at", :null => false
  end

  create_table "users", :force => true do |t|
    t.string   "username"
    t.string   "password_hash"
    t.datetime "created_at",                       :null => false
    t.datetime "updated_at",                       :null => false
    t.integer  "group_id"
    t.integer  "member_id"
    t.string   "first_name"
    t.string   "last_name"
    t.text     "note"
    t.string   "class_name"
    t.text     "metadata",      :limit => 2097152
  end

  add_index "users", ["username", "password_hash"], :name => "index_users_on_username_and_password_hash"

end