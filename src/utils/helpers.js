// Helper functions for localStorage
export const getUserFromStorage = () => {
  try {
    return JSON.parse(localStorage.getItem('neighborhood_watch_user'));
  } catch (error) {
    return null;
  }
};

export const setUserToStorage = (user) => {
  localStorage.setItem('neighborhood_watch_user', JSON.stringify(user));
};

export const removeUserFromStorage = () => {
  localStorage.removeItem('neighborhood_watch_user');
};