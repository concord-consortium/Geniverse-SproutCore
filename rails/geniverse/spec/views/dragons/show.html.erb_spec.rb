require 'spec_helper'

describe "/dragons/show.html.erb" do
  include DragonsHelper
  before(:each) do
    assigns[:dragon] = @dragon = stub_model(Dragon,
      :name => "value for name",
      :sex => 1,
      :alleles => "value for alleles",
      :imageURL => "value for imageURL",
      :mother_id => 1,
      :father_id => 1,
      :bred => false,
      :user_id => 1
    )
  end

  it "renders attributes in <p>" do
    render
    response.should have_text(/value\ for\ name/)
    response.should have_text(/1/)
    response.should have_text(/value\ for\ alleles/)
    response.should have_text(/value\ for\ imageURL/)
    response.should have_text(/1/)
    response.should have_text(/1/)
    response.should have_text(/false/)
    response.should have_text(/1/)
  end
end
