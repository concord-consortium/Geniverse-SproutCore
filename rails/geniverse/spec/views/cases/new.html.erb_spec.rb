require 'spec_helper'

describe "/cases/new.html.erb" do
  include CasesHelper

  before(:each) do
    assigns[:case] = @case = stub_model(Case, {:id => nil})
  end

  it "renders new case form" do
    render

    response.should have_tag("form[action=?][method=post]", cases_path) do
      %w{ name order }.each do |att|
        with_tag("input#case_#{att}[name=?]", "case[#{att}]")
      end
    end
  end
end
