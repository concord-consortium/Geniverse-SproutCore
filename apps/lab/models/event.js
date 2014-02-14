/**
  List of log events. Made to be as similar as possible to GeniGames log events.
*/

Lab.EVENT = {  
    STARTED_SESSION       : "Started session"
  , USER_LOGGED_IN        : "User logged in"
  , USER_LOGGED_OUT       : "User logged out"
  , ENDED_SESSION         : "Ended session"

    // Challenge events
  , STARTED_CHALLENGE     : "Started challenge"
  , COMPLETED_CHALLENGE   : "Completed challenge"
  , STARS_EARNED          : "Stars earned"

    // Breeding events
  , SELECTED_PARENT       : "Selected parent"
  , REMOVED_PARENT        : "Removed parent"
  , BRED_DRAGONS          : "Bred dragons"
  , KEPT_OFFSPRING        : "Kept offspring"
  , SUBMITTED_OFFSPRING   : "Submitted offspring"

    // Chromosome events
  , CHANGED_ALLELE        : "Changed allele"

    // Meiosis events
  , CHOSE_CHROMOSOME      : "Chromosome selected"
  , DESELECTED_CHROMOSOME : "Chromosome deselected"
  , MADE_CROSSOVER        : "Crossover selected"
};