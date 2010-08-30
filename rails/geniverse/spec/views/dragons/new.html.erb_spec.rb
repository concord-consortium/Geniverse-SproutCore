require 'spec_helper'

describe "/dragons/new.html.erb" do
  include DragonsHelper

  before(:each) do
    assigns[:dragon] = stub_model(Dragon,
      :new_record? => true,
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

  it "renders new dragon form" do
    render

    response.should have_tag("form[action=?][method=post]", dragons_path) do
      with_tag("input#dragon_name[name=?]", "dragon[name]")
      with_tag("input#dragon_sex[name=?]", "dragon[sex]")
      with_tag("input#dragon_alleles[name=?]", "dragon[alleles]")
      with_tag("input#dragon_imageURL[name=?]", "dragon[imageURL]")
      with_tag("input#dragon_mother_id[name=?]", "dragon[mother_id]")
      with_tag("input#dragon_father_id[name=?]", "dragon[father_id]")
      with_tag("input#dragon_bred[name=?]", "dragon[bred]")
      with_tag("input#dragon_user_id[name=?]", "dragon[user_id]")
    end
  end
end
