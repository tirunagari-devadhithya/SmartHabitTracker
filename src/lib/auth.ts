export async function signUp(email: string, password: string) {
  // Simple password validation
  if (password.length < 6) {
    throw new Error('Password must be at least 6 characters');
  }
  
  // Store user in local storage
  const user = {
    id: crypto.randomUUID(),
    email,
    created_at: new Date().toISOString()
  };
  
  localStorage.setItem('user', JSON.stringify(user));
  return { user };
}

export async function signIn(email: string, password: string) {
  const storedUser = localStorage.getItem('user');
  if (!storedUser) {
    throw new Error('User not found');
  }
  
  const user = JSON.parse(storedUser);
  if (user.email !== email) {
    throw new Error('Invalid credentials');
  }
  
  return { user };
}

export async function signOut() {
  localStorage.removeItem('user');
}

export async function getCurrentUser() {
  const storedUser = localStorage.getItem('user');
  return storedUser ? JSON.parse(storedUser) : null;
}