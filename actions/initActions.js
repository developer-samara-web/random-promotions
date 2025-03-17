// Импорты
import startAction from "#actions/startAction.js"
import userProfileAction from "#actions/user/profile/userProfileAction.js";
import userSubscribeAction from "#actions/user/profile/subscribe/userSubscribeAction.js";
import userPremiumAction from "#actions/user/premium/userPremiumAction.js";
import userPremiumShowAction from "#actions/user/premium/userPremiumShowAction.js";
import userPremiumPaymentAction from "#actions/user/premium/userPremiumPaymentAction.js";

// Список экшенов
export default (telegram) => {
  startAction(telegram);
  userProfileAction(telegram);
  userSubscribeAction(telegram);
  userPremiumAction(telegram);
  userPremiumShowAction(telegram);
  userPremiumPaymentAction(telegram);
};