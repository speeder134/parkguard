// lib/api/client.ts
import axios, { AxiosInstance } from 'axios';

class ApiClient {
  private client: AxiosInstance;
  private baseUrl: string = 'https://api.parkguard.app';

  constructor() {
    this.client = axios.create({
      baseURL: this.baseUrl,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });

    // Interceptor pour ajouter le token Firebase
    this.client.interceptors.request.use(async (config) => {
      try {
        const token = await this.getFirebaseToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      } catch (error) {
        console.error('Error getting Firebase token:', error);
      }
      return config;
    });
  }

  private async getFirebaseToken(): Promise<string | null> {
    try {
      // On obtient le token ID Firebase
      const { auth } = await import('../firebase/auth');
      const user = auth().currentUser;
      if (user) {
        return await user.getIdToken();
      }
      return null;
    } catch (error) {
      console.error('Error getting Firebase token:', error);
      return null;
    }
  }

  // Méthodes de base
  public get<T>(url: string, params?: any) {
    return this.client.get<T>(url, { params });
  }

  public post<T>(url: string,  any) {
    return this.client.post<T>(url, data);
  }

  public put<T>(url: string,  any) {
    return this.client.put<T>(url, data);
  }

  public delete<T>(url: string) {
    return this.client.delete<T>(url);
  }
}

export const api = new ApiClient();