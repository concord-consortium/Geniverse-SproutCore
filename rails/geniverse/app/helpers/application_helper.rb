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
end
