# Methods added to this helper will be available to all templates in the application.
module ApplicationHelper
  def custom_string(obj)
    case obj
    when Hash
      obj.inspect
    when Array
      obj.inspect
    else
      obj.to_s
    end
  end

  def error_messages(object)
    msg = ""
    if object.errors.any?
      msg << "<div id='error_explanation'>\n"
      msg << "<h2>#{pluralize(object.errors.count, "Error")} prohibited this post from being saved:</h2>\n"
      msg << "<ul>\n"
      object.errors.full_messages.each do |msg|
        msg << "<li>#{msg}</li>\n"
      end
      msg << "</ul>\n"
      msg << "</div>\n"
    end
    return msg.html_safe
  end
end
