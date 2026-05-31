const ROLE_KEY = 'user_role';

export const UserCache = {
  setRole: (role: string) => localStorage.setItem(ROLE_KEY, role),
  getRole: (): 'MAHASISWA' | 'STAFF' | null => {
    const r = localStorage.getItem(ROLE_KEY);
    return r === 'MAHASISWA' || r === 'STAFF' ? r : null;
  },
  clear: () => localStorage.removeItem(ROLE_KEY),
};
