/**
 * Brick Blitz - Authentication & Profile Manager
 */

export class AuthManager {
  constructor(storageManager) {
    this.storage = storageManager;
  }

  login(username, password) {
    const data = this.storage.data;
    const profile = data.profiles[username];

    if (!profile) {
      return { success: false, message: 'User profile not found.' };
    }

    if (profile.passwordHash && profile.passwordHash !== password) {
      return { success: false, message: 'Incorrect password.' };
    }

    data.currentUser = username;
    this.storage.saveData();
    return { success: true, profile };
  }

  register(username, password) {
    if (!username || username.trim().length < 2) {
      return { success: false, message: 'Username must be at least 2 characters.' };
    }

    const data = this.storage.data;
    if (data.profiles[username]) {
      return { success: false, message: 'Username already exists.' };
    }

    const newProfile = this.storage.createEmptyProfile(username);
    newProfile.passwordHash = password || '';
    data.profiles[username] = newProfile;
    data.currentUser = username;
    this.storage.saveData();

    return { success: true, profile: newProfile };
  }

  getCurrentUser() {
    return this.storage.getCurrentProfile();
  }
}
