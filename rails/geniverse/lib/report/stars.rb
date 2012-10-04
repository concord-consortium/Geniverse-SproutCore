class Report::Stars
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
    sheet = wb.create_worksheet :name => 'stars'

    cols = {}
    headers = ['Username', 'Login', 'Class', 'Group #', 'Group member #']
    #Activity.all.each do |a|
    caselogActivities.each do |a|
      cols[a.id] = headers.size
      headers << a.title
    end

    sheet.row(0).concat headers
    row_num = 1
    User.all.each do |u|
      next if u.class_name.nil? || u.class_name.empty?
      sheet.row(row_num).concat ["#{u.first_name} #{u.last_name}", u.username, u.class_name, u.group_id, u.member_id]
      if md = u.metadata
        if stars = md['stars']
          # sort so that rails ids will always come before route ids
          stars.keys.sort.each do |path|
            vals = stars[path]
            id = -1
            if path =~ /\/rails\/activities\/(\d+)/
              id = $1.to_i
            else
              # maybe it's a route: case1/challenge1
              a = Activity.find_by_route(path)
              id = a.id if a
            end
            if col = cols[id]
              realVals = vals.map{|v|
                res = case v
                when Hash
                  "#{v['stars']} (#{v['time']})"
                else
                  v
                end
              }
              if sheet[row_num, col] && !sheet[row_num, col].empty?
                sheet[row_num, col] += ","
              end
              sheet[row_num, col] ||= ""
              sheet[row_num, col] += realVals.join(',')
            end
          end
        end
      end
      row_num += 1
    end
    wb.write stream_or_path
  end
end
