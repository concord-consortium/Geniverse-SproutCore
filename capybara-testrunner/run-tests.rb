#!/usr/bin/env ruby

$:.unshift File.join(File.dirname(__FILE__), 'lib')

require 'trollop'  # For processing command-line options
require 'fileutils'

require 'capybara'
require 'capybara/dsl'
require 'transform-results'
# this is only needed to save a fixture for testing the transform code
require 'yaml'

# Process command-line options
@options = Trollop::options do
  opt :driver, "Capybara driver", :short => 'd', :type => String, :default => "selenium"

  # look for an environment variable so the port can be changed depending on
  # the ci node that is running it
  opt :sc_server_port, "SC Server Port", :short => 'p', :type => :int, :default => (ENV['SC_SERVER_PORT'].to_i || 4020)
  opt :sc_server_host, "SC Server Host", :short => 's', :type => :string, :default => "sc.local" # was localhost but Apache proxying to sc.local is faster

  opt :root_dir, "Root directory", :short => 'r', :type => :string, :default => ".."
  opt :tests_dir, "Tests directory", :short => 't', :type => :string, :default => "{apps,frameworks}"
  opt :exclude_dir, "Exclude test directory", :short => 'x', :type => :string, :multi => true

  opt :results_dir, "Results directory", :short => 'o', :type => :string, :default => "results"
  opt :junit, "Output JUnit XML", :short => 'j', :default => true
  opt :image, 'Save a png snapshot of the test page', :short => 'i', :default => false
  opt :html, 'Save an html snapshot of the test page', :short => 'h', :default => false

  opt :quiet, 'Quiet mode. Do not print messages while running', :short => 'q', :default => false
end

Trollop::die :image, "can only be enabled if using the selenium driver (you're using: #{@options[:driver]})" if @options[:image] && @options[:driver] != "selenium"

FileUtils.mkdir_p @options[:results_dir]

Capybara.current_driver = @options[:driver].to_sym
Capybara.app_host = "http://#{@options[:sc_server_host]}:#{@options[:sc_server_port]}"

include Capybara

# find all of the test subfolders in the tests of the current apps
# FIXME should change to support nested folders inside of tests
testFolders = Dir.glob( File.join(@options[:root_dir], @options[:tests_dir], "**", "tests", "*") )

excludes = [File.join("tmp","**")] + @options[:exclude_dir]
testFolders = testFolders.reject{|folder|
  excludes.any?{|exclude| File.fnmatch?(File.join(@options[:root_dir], exclude), folder)}
}

TEST_REGEXP = Regexp.new('.*?(frameworks|apps)/(.*)/tests/(.*)')
testURLs = testFolders.collect{|folder|
  puts "will gather tests from folder #{folder}" unless @options[:quiet]
  # switch to url slashes
  folder.gsub!(File::SEPARATOR, '/')
  paths = TEST_REGEXP.match(folder)
  url_base = paths[2].gsub('frameworks/','')
  # remove .js from the end of paths[3] if it's found
  path3 = paths[3]
  p3len = path3.length
  if p3len > 3
    if (path3[p3len - 3, p3len - 1].casecmp ".js") == 0
      path3 = path3[0, p3len - 3]
    end
  end
  puts "will visit static URL:/#{url_base}/en/current/tests/#{path3}.html"
  {:url => "/#{url_base}/en/current/tests/#{path3}.html",
   :results_file => File.join(@options[:results_dir], "#{url_base}-#{path3}-junit.xml".gsub('/',"-")),
   :results_html_file => File.join(@options[:results_dir], "#{url_base}-#{path3}-page.html".gsub('/',"-")),
   :results_png_file => File.join(@options[:results_dir], "#{url_base}-#{path3}-page.png".gsub('/',"-"))
   }
}

def save_results_xml(url)
  results = evaluate_script('CoreTest.plan.results')
  File.open(url[:results_file], 'w'){|file|
    TransformResults.transform(results, file)
  }
  #uncomment this to save results for quicker testing of the transform
  #puts results.to_yaml
end

def save_page_png(file_path)
  Capybara.current_session.driver.browser.save_screenshot(file_path)
end

def save_page_html(file_path)
  # FIXME How do we get the result html without re-running the tests?
  # one method: get the current DOM and any script elements. this is possibly too aggressive
  html = body.gsub(/<script.*?<\/script>/m, '')
  File.open(file_path, 'w'){|file|
    file.write(html)
    file.flush
  }
end

testURLs.each{|url|
  print "visiting #{url[:url]}..." unless @options[:quiet]
  visit(url[:url])
  print "visited\n" unless @options[:quiet]
  sleep 15 # give the page time to complete all tests and rendering before saving results
  save_results_xml(url) if @options[:junit]
  save_page_png(url[:results_png_file]) if @options[:image]
  save_page_html(url[:results_html_file]) if @options[:html]
}
