require 'spec_helper'

describe "cases/show.json.erb" do
  # before(:each) do
  #   @case_pages =  [CasePage.create(:name => "page name", :intro_text => "intro_text")]
  #   @case = Case.create(:title => "title of case", :case_pages => @case_pages)
  #   assigns[:case] = @case
  # end
  include CasesHelper
  before(:each) do
    @case_hash = {
      :name => "value for name",
      :order => 1
    }
    assigns[:case] = @case = stub_model(Case, @case_hash)
  end

  it "renders showing JSON of an case as SproutCore client expects it" do
    render
    response.body.should match("\"content\":")
    response.body.should match("\"guid\":\"/rails/cases/[0-9]*")
    @case_hash.each do |k,v|
      k_str = k.to_s.camelcase.sub(/^[A-Z]/) {|l| l.downcase }
      expected = %!"#{k_str}":!
      if v.kind_of?(Fixnum) || v.kind_of?(FalseClass) || v.kind_of?(TrueClass)
        expected << v.to_s
      else
        expected << %!"#{v.to_s}"!
      end
      response.body.should match(expected)
    end
  end
end
