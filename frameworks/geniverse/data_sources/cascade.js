// ==========================================================================
// Project:   Geniverse.CascadeDataSource
// Copyright: ©2010 Concord Consortium
// ==========================================================================
/*globals Geniverse */
sc_require('data_sources/rails');
Geniverse.CascadeDataSource = SC.CascadeDataSource.extend({
  dataSources: "rails fixtures".w(),

  rails: Geniverse.RailsDataSource.create(),
  fixtures: SC.FixturesDataSource.extend({simulateRemoteResponse: YES}).create()
});

