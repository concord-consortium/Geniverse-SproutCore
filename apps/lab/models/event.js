/**
  List of log events. Made to be as similar as possible to GeniGames log events.
*/

Lab.EVENT = {  
    STARTED_SESSION       : "Started session"
  , USER_LOGGED_IN        : "User logged in"
  , USER_LOGGED_OUT       : "User logged out"
  , ENDED_SESSION         : "Ended session"

  , MOVED_TO              : "Moved to"

    // Challenge events
  , STARTED_CHALLENGE     : "Started challenge"
  , COMPLETED_CHALLENGE   : "Completed challenge"
  , REPEAT_CHALLENGE      : "Repeat challenge"
  , STARS_EARNED          : "Stars earned"
  , DRAKE_SUBMITTED       : "Drake submitted"
  , DRAKES_REVEALED       : "Drakes revealed"

    // Breeding events
  , SELECTED_PARENT       : "Selected parent"
  , REMOVED_PARENT        : "Removed parent"
  , BRED_DRAGONS          : "Bred dragons"
  , KEPT_OFFSPRING        : "Kept offspring"
  , KEPT_OFFSPRING_FAILED : "Failed to keep offspring"

  // Stats
  , OPENED_STATS          : "Opened stats tab"
  , CLOSED_STATS          : "Closed stats tab"
  , CHANGED_STATS         : "Changed stats trait"
  , INITIAL_STATS         : "Initial stats trait"

  // Meiosis events
  , COMPLETED_MEIOSIS     : "Completed meiosis"
  , SELECTED_GAMETE       : "Selected gamete"
  , RESTARTED_MEIOSIS     : "Restarted meiosis"
  , PRODUCED_OFFSPRING_BY_MEIOSIS : "Produced offspring by meiosis"

    // Chromosome events
  , CHANGED_ALLELE        : "Changed allele"

    // Meiosis events
  , CHOSE_CHROMOSOME      : "Chromosome selected"
  , DESELECTED_CHROMOSOME : "Chromosome deselected"
  , MADE_CROSSOVER        : "Crossover selected"

  , EXAMINED_GENOTYPE     : "Examined genotype"

  // Toolbar icons
  , OPENED_INFO           : "Opened info"
  , CLOSED_INFO           : "Closed info"
  , OPENED_NOTEPAD        : "Opened notepad"
  , CLOSED_NOTEPAD        : "Closed notepad"
  , SAVED_NOTEPAD         : "Saved and closed notepad"
  , OPENED_HELP           : "Opened help"
  , CLOSED_HELP           : "Closed help"

  // Journal
  , OPENED_JOURNAL_POST   : "Opened journal post window"
  , CLOSED_JOURNAL_POST   : "Closed journal post window"
  , SAVED_JOURNAL_POST    : "Saved journal draft"
  , JOURNAL_POST          : "Submitted journal entry"
  , JOURNAL_POST_FAILED   : "Failed to submit journal entry"
  , GO_TO_JOURNAL_POST    : "Navigated to journal post"
  , GO_TO_JOURNAL         : "Navigated to journal"
};