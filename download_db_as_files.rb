#!/bin/env ruby

require 'uri'
require 'net/http'

VERBOSE=true
STDOUT.sync = true
DB_BASE = "http://geniverse.concord.org/rails/"
BASE_DIR = File.join(File.dirname(__FILE__), "tmp", "build", "rails")

def download(uri_str, dest)
  body = Net::HTTP.get_response(URI.parse(uri_str)).body
  File.open(dest, "w") do |f|
    f.write(body)
  end
  return body
end

Dir.mkdir(File.join(File.dirname(__FILE__), "tmp")) rescue Errno::EEXIST
Dir.mkdir(File.join(File.dirname(__FILE__), "tmp", "build")) rescue Errno::EEXIST
Dir.mkdir(BASE_DIR) rescue Errno::EEXIST

print "Downloading: users "
File.open(File.join(BASE_DIR, "users.json"), "w") do |f|
  f.write('{"content":[{"passwordHash":"e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855","lastName":"User","guid":"/rails/users/1","memberId":1,"username":"user","metadata":null,"className":"no_class","firstName":"User","note":"","groupId":1}]}')
end
puts " done."

["cases","activities","help_messages"].each do |model|
  Dir.mkdir(File.join(BASE_DIR, model)) rescue Errno::EEXIST

  print "Downloading: #{model} "
  all = download(DB_BASE + "#{model}.json", File.join(BASE_DIR, model + ".json"))

  come_back = []
  all.scan(/"guid":"[^"]*?\/(\d+)"/) do |id|
    tries = 0
    url = DB_BASE + "#{model}/#{id}.json"
    filename = File.join(BASE_DIR, model, "#{id}.json")
    begin
      tries += 1
      download(url, filename)
      print "."
    rescue Exception
      sleep 2
      retry if tries < 3
      $stderr.puts "Error downloading: #{url}"
      come_back << {:url => url, :file => filename}
    end
  end

  if !come_back.empty?
    puts " done."

    print "Trying failures again "
    come_back.each do |f|
      tries = 0
      begin
        tries += 1
        download(f[:url],f[:file])
        print "."
      rescue Exception
        sleep 2
        retry if tries < 3
        $stderr.puts "STILL Error downloading: #{url}"
      end
    end
  end

  puts " done."
end
