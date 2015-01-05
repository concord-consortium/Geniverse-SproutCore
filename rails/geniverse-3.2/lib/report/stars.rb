class Report::Stars
  attr_accessor :class_name
  attr_accessor :all_classes

  def initialize(class_names)
    @class_names = class_names || []
    @all_classes = @class_names.include?("|ALL|") ? true : false
    @current_row = {:stars => 1, :posts => 1}
  end

  def caselogActivities
    json = File.read(File.join(File.dirname(__FILE__),'..','..','..','..','apps','lab','cases.js'))
    json.sub!(/.*?Lab.caselogData = \[/m, '[')
    json.sub!(/\];.*?call\(this\);.*/m, ']')
    json.gsub!(/([a-zA-Z0-9]+): ("|t|\[|\{)/) do |m|
      %!"#{$1}": #{$2}!
    end
    data = JSON.parse(json)
    acts = []
    data.each do |level|
      level["cases"].each do |kase|
        kase["challenges"].each do |act|
          acts << act if act = Activity.find_by_route(act['href'].sub(/^#/,''))
        end
      end
    end
    return acts
  end

  def run(stream_or_path = 'stars_report.xls')
    wb = Spreadsheet::Workbook.new
    stars_sheet = wb.create_worksheet :name => 'stars'
    journal_sheet = wb.create_worksheet :name => 'journal'

    @cols = {}
    headers = ['Username', 'Login', 'Class', 'Group #', 'Group member #']

    @current_row = {:stars => 1, :posts => 1}

    caselogActivities.each do |a|
      @cols[a.id] = headers.size
      headers << a.title
    end

    stars_sheet.row(0).concat headers
    journal_sheet.row(0).concat ['Username', 'Login', 'Class', 'Date/Time', 'Challenge', 'Title', 'Claim', 'Evidence', 'URL', 'Reasoning']

    User.all.each do |u|
      next if u.class_name.nil? || u.class_name.empty?
      next unless @all_classes || @class_names.include?(u.class_name.strip)

      process_stars(stars_sheet, u)
      process_posts(journal_sheet, u)
    end
    wb.write stream_or_path
  end

  def lookup_id_from_path(path)
    id = -1
    if path =~ /\/rails\/activities\/(\d+)/
      id = $1.to_i
    else
      # maybe it's a route: case1/challenge1
      a = Activity.find_by_route(path)
      id = a.id if a
    end
    return id
  end

  def process_stars(sheet, u)
    sheet.row(@current_row[:stars]).concat ["#{u.first_name} #{u.last_name}", u.username, u.class_name.strip, u.group_id, u.member_id]
    if md = u.metadata
      if (stars = md['stars']) && stars.is_a?(Hash)
        # sort so that rails ids will always come before route ids
        stars.keys.sort.each do |path|
          vals = stars[path]
          id = lookup_id_from_path(path)
          if col = @cols[id]
            realVals = vals.map{|v|
              case v
              when Hash
                "#{v['stars']} (#{v['time']})"
              else
                v
              end
            }
            if sheet[@current_row[:stars], col] && sheet[@current_row[:stars], col] != ""
              sheet[@current_row[:stars], col] = sheet[@current_row[:stars], col].to_s + ","
            end
            sheet[@current_row[:stars], col] ||= ""
            sheet[@current_row[:stars], col] += realVals.join(',').to_s
          end
        end
      end
    end
    @current_row[:stars] += 1
  end

  # Columns are: ['Username', 'Login', 'Class', 'Date/Time', 'Challenge', 'Title', 'Claim', 'Evidence', 'URL', 'Reasoning']
  def process_posts(sheet, user)
    Rails.logger.warn "Processing posts in stars report.\n=======\n#{user.metadata.inspect}\n============="
    common_row_data = ["#{user.first_name} #{user.last_name}", user.username, user.class_name.strip]
    if (md = user.metadata) && md.is_a?(Hash) && (posts = md['posts']) && posts.is_a?(Hash)
      # sort so that rails ids will always come before route ids
      posts.keys.sort.each do |path|
        vals = posts[path]
        id = lookup_id_from_path(path)
        if id != -1 && vals && vals.is_a?(Array) && !vals.empty?
          vals.each do |post|
            if post && post.is_a?(Hash) && (act = caselogActivities.detect{|a| a.id == id })
              sheet.row(@current_row[:posts]).concat(common_row_data + [post['time'], act.title, post['title'], post['claim'], post['evidence'], post['url'], post['reasoning']])

              @current_row[:posts] += 1
            end
          end
        end
      end
    else
      sheet.row(@current_row[:posts]).concat(common_row_data + ['no arguments submitted yet'])

      @current_row[:posts] += 1
    end
  end
end
