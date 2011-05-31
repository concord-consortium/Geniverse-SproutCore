dir = File.expand_path(File.dirname(__FILE__))
require "#{dir}/../support/spec_helper.rb"

describe "Articles" do
  before(:all) do
    start_testing_servers
    @app = new_test({:app_root_path => "/lab#pagetype/reference/breedingPageGroup"}) {|app|
      app['isLoaded'] == true

      app.move_to 1, 1 
      app.resize_to 1024, 768

      define_common_paths(app)
      app.define_path 'breedPage', "breedingPageGroup.mainPane.mainAppView"
      app.define_path 'yourArticle', "breedingPageGroup.mainPane.mainAppView.allArticlesView.article"
    }
    define_common_ivars

    @article_text = @app['yourArticle.staticView.textView.contentView', 'SC.LabelView']
    @new_paper_button = @app['yourArticle.staticView.newButtonView', 'SC.ButtonView']
    @edit_paper_button = @app['yourArticle.staticView.editButtonView', 'SC.ButtonView']
    @send_draft_button = @app['yourArticle.staticView.sendDraftButtonView', 'SC.ButtonView']

    @claim_text_field = @app['yourArticle.editingView.entryView.inputClaimView', 'SC.TextFieldView']
    @evidence_text_field = @app['yourArticle.editingView.entryView.inputEvidenceView', 'SC.TextFieldView']
    @reasoning_text_field = @app['yourArticle.editingView.entryView.inputReasoningView', 'SC.TextFieldView']

    @preview_paper = @app['yourArticle.editingView.previewButtonView', 'SC.ButtonView']

    # NOT USED ANY MORE ?
    #
    # @dragon_bin = @app['yourArticle.editingView.dragonBinView', 'Geniverse.DragonBinView']
    # @static_dragon_bin = @app['yourArticle.staticView.dragonBinView', 'Geniverse.DragonBinView']
    # @add_dragons_label = @app['yourArticle.editingView.dragonBinView.addDragonsLabel', 'SC.LabelView']
    # @clear_dragons = @app['yourArticle.editingView.clearDragonsButton', 'SC.ButtonView']

    @breed_button = @app['breedPage.breedView.breedButtonView', 'SC.ButtonView']
    @breeding_pen_view = @app['breedPage.breedingPenView', 'Lab.BreedingPenView']
    @stable_view = @app['breedPage.stableView', 'Lab.StableView']

    @challenge_pool_view = @app['breedPage.challengePoolView', 'Lab.ChallengePoolView']
    @mother_view = @app['breedPage.breedView.motherView', 'Geniverse.OrganismView']
    @father_view = @app['breedPage.breedView.fatherView', 'Geniverse.OrganismView']

    login("student", 'password')
    hide_info_pane
  end

  after(:all) do
    stop_testing_servers
  end

  it "should see initial article text immediately" do
    @article_text.isVisibleInWindow.should be_true
    @article_text.value.should eql "<div id='article'><div class='claim'><i>Write your thoughts here.</i></div></div>"
    @app['yourArticle.editingView'].isVisibleInWindow.should_not be_true
  end

  it "should see editing view when New Paper is clicked" do
    @new_paper_button.isVisibleInWindow.should be_true
    @new_paper_button.isEnabled.should be_true
    @edit_paper_button.isEnabled.should_not be_true

    @new_paper_button.click

    @article_text.isVisibleInWindow.should_not be_true
    @app['yourArticle.editingView'].isVisibleInWindow.should be_true
    @claim_text_field.fieldValue.should eql "<i>Write your thoughts here.</i>"
    @evidence_text_field.fieldValue.should eql ""
    @reasoning_text_field.fieldValue.should eql ""
  end

  it "should be able to fill in values in all three sections" do
    @claim_text_field.type "claim"
    @evidence_text_field.type "evidence"
    @reasoning_text_field.type "reasoning"

    @preview_paper.click
  end

  it "should show the edits of all three sections" do
    pending
  end

  it "should be able to edit paper again" do
    @edit_paper_button.isVisibleInWindow.should be_true
    @edit_paper_button.isEnabled.should be_true

    @edit_paper_button.click

    @article_text.isVisibleInWindow.should_not be_true
    @app['yourArticle.editingView'].isVisibleInWindow.should be_true

    @claim_text_field.fieldValue.should eql "claim"
    @evidence_text_field.fieldValue.should eql "evidence"
    @reasoning_text_field.fieldValue.should eql "reasoning"

    @preview_paper.click
  end

  it 'should be able to submit a paper to the group' do
    pending
  end
end
