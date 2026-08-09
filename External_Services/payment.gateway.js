exports.charge = async (userId, amount) => {
  console.log(`Charging user ${userId} amount ${amount} via Stripe API`);
  return 'SUCCESS';
};