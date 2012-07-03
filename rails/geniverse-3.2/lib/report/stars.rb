class Report::Stars
  def caselogActivities
    json = File.read(File.join(File.dirname(__FILE__),'..','..','..','..','apps','lab','cases.js'))
    json.sub!(/.*?Lab.caselogData = \[/m, '[')
    json.sub!(/\];.*?call\(this\);.*/m, ']')
    json.gsub!(/([a-z]+): /) do |m|
      %!"#{$1}": !
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

  def run
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
          stars.each do |path, vals|
            id = path.gsub('/rails/activities/', '').to_i
            if col = cols[id]
              sheet[row_num, col] = vals.join(',')
            end
          end
        end
      end
      row_num += 1
    end
    wb.write 'stars_report.xls'
  end
end
