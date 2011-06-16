require 'spec_helper'

describe "/cases/index.json.erb" do
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

  it "renders a list of cases in JSON format as SproutCore client expects it" do
    render
    response.body.should match('"content":')
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
