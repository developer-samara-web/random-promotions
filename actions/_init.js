// Импорты
import { startAction, rulesAction } from "#actions/mainActions.js";
import { profileAction, subscribeUserAction, subscribeToggleAction, subscribeEmptyAction } from "#actions/userActions.js";
import { subscribeAction, subscribeShowAction, subscribeShowRulesAction, subscribePaymentAction } from "#actions/subscribeActions.js";
import { adminAction } from "#actions/adminActions.js";

// Список экшенов
export default (telegram) => {
  // mainActions
  startAction(telegram);
  rulesAction(telegram);

  //userActions
  profileAction(telegram);
  subscribeUserAction(telegram);
  subscribeToggleAction(telegram);
  subscribeEmptyAction(telegram);

  //subscribeActions
  subscribeAction(telegram);
  subscribeShowAction(telegram);
  subscribeShowRulesAction(telegram);
  subscribePaymentAction(telegram);

  //adminActions
  adminAction(telegram);
};