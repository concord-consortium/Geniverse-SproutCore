require 'spec_helper'

describe "/dragons/index.html.erb" do
  include DragonsHelper

  before(:each) do
    assigns[:dragons] = [
      stub_model(Dragon,
        :name => "value for name",
        :sex => 1,
        :alleles => "value for alleles",
        :imageURL => "value for imageURL",
        :mother_id => 1,
        :father_id => 1,
        :bred => false,
        :user_id => 1
      ),
      stub_model(Dragon,
        :name => "value for name",
        :sex => 1,
        :alleles => "value for alleles",
        :imageURL => "value for imageURL",
        :mother_id => 1,
        :father_id => 1,
        :bred => false,
        :user_id => 1
      )
    ]
  end

  it "renders a list of dragons" do
    render
    response.should have_tag("tr>td", "value for name".to_s, 2)
    response.should have_tag("tr>td", 1.to_s, 2)
    response.should have_tag("tr>td", "value for alleles".to_s, 2)
    response.should have_tag("tr>td", "value for imageURL".to_s, 2)
    response.should have_tag("tr>td", 1.to_s, 2)
    response.should have_tag("tr>td", 1.to_s, 2)
    response.should have_tag("tr>td", false.to_s, 2)
    response.should have_tag("tr>td", 1.to_s, 2)
  end
end
