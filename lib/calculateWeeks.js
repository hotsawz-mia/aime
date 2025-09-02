const calculateWeeks = (targetDate) => {
  const today = new Date();
  const target = new Date(targetDate);
  
  // Handle invalid dates
  if (isNaN(target.getTime())) {
    return 8; // Default to 8 weeks for invalid dates
  }
  
  const timeDifference = target.getTime() - today.getTime();
  const daysDifference = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));
  const numberOfWeeks = Math.ceil(daysDifference / 7);
  
  return Math.max(numberOfWeeks, 1);
};

export default calculateWeeks;
