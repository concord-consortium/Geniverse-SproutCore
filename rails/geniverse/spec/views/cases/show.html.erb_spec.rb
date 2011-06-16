require 'spec_helper'

describe "/cases/show.html.erb" do
  include CasesHelper
  before(:each) do
    @case_hash = {
      :name => "value for name",
      :order => 1
    }
    assigns[:case] = @case = stub_model(Case,@case_hash)
  end

  it "renders attributes in <p>" do
    render
    @case_hash.each do |k,v|
      response.should have_text(Regexp.new(v.to_s))
    end
  end
end
