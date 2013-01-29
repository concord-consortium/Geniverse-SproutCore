// ==========================================================================
// Project:   Geniverse.CascadeDataSource
// Copyright: ©2010 Concord Consortium
// ==========================================================================
/*globals Geniverse */
sc_require('data_sources/rails');
Geniverse.CascadeDataSource = SC.CascadeDataSource.extend({
  dataSources: "rails fixtures".w(),

  rails: Geniverse.RailsDataSource.create(),

  // without simulateRemoteResponse and a latency, we get errors where records appear to have
  // their state set to READY too early, even if the fixtures data source isn't being used. With
  // these paramters the situation is helped somewhat, but is still inconsistant.
  // Geniverse.CascadeDataSource should not be used until this issue is resolved.
  fixtures: SC.FixturesDataSource.extend({simulateRemoteResponse: YES, latency: 1000}).create()
});

