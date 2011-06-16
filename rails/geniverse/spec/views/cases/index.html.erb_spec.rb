require 'spec_helper'

describe "/cases/index.html.erb" do
  include CasesHelper

  before(:each) do
    @case_hash = {
      :name => "value for name",
      :order => 1
    }
    assigns[:cases] = [
      stub_model(Case, @case_hash),
      stub_model(Case, @case_hash)
    ]
  end

  it "renders a list of cases" do
    render
    @case_hash.each do |k,v|
      response.should have_tag("tr>td", v.to_s, 2)
    end
  end
end
