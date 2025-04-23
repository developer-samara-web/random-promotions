// Импорты
import { startAction, rulesAction } from "#actions/mainActions.js";
import { profileAction, supportAction } from "#actions/userActions.js";
import { subscribeAction, subscribeShowAction, subscribeShowRulesAction } from "#actions/subscribeActions.js";
import { adminAction } from "#actions/adminActions.js";

// Список экшенов
export default (telegram) => {
  // mainActions
  startAction(telegram);
  rulesAction(telegram);

  //userActions
  profileAction(telegram);
  supportAction(telegram);

  //subscribeActions
  subscribeAction(telegram);
  subscribeShowAction(telegram);
  subscribeShowRulesAction(telegram);

  //adminActions
  adminAction(telegram);
};