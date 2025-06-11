const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export const api = {
  // Posts endpoints
  posts: {
    getAll: () => `${API_BASE_URL}/posts`,
    getById: (id: string | number) => `${API_BASE_URL}/posts/${id}`,
    create: () => `${API_BASE_URL}/posts`,
    like: (id: string | number) => `${API_BASE_URL}/posts/${id}/like`,
    comment: (id: string | number) => `${API_BASE_URL}/posts/${id}/comment`,
  },
  
  // Users endpoints
  users: {
    getByWallet: (wallet: string) => `${API_BASE_URL}/users/${wallet}`,
    create: () => `${API_BASE_URL}/users`,
  },
  
  // Auth endpoints
  auth: {
    verify: () => `${API_BASE_URL}/auth/verify`,
    nonce: () => `${API_BASE_URL}/auth/nonce`,
  },
};

export const formatAddress = (address: string): string => {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffHours / 24);

  if (diffDays > 0) {
    return `${diffDays}d ago`;
  } else if (diffHours > 0) {
    return `${diffHours}h ago`;
  } else {
    const diffMins = Math.floor(diffMs / (1000 * 60));
    return diffMins > 0 ? `${diffMins}m ago` : 'just now';
  }
}; 