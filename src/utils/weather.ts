export const getDynamicCondition = (temperature) => {
  if (temperature > 30) return 'Hot';
  if (temperature > 20) return 'Warm';
  if (temperature > 10) return 'Cool';
  return 'Cold';
};
