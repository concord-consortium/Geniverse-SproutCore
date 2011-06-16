require 'spec_helper'

describe "/cases/edit.html.erb" do
  include CasesHelper

  before(:each) do
    assigns[:case] = @case = stub_model(Case,{
      :name => "value for name",
      :order => 1
    }
    )
  end

  it "renders the edit case form" do
    render

    response.should have_tag("form[action=#{case_path(@case)}][method=post]") do
      %w{ name order }.each do |att|
        with_tag("input#case_#{att}[name=?]", "case[#{att}]")
      end
    end
  end
end
