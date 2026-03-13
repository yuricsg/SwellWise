// Service para consumir a API SwellWise
import type {
  Beach,
  BeachListResponse,
  BeachCondition,
  BeachForecast,
} from "@/types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

class ApiService {
  private async fetcher<T>(endpoint: string): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store", // Sempre buscar dados frescos
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`);
    }

    return response.json();
  }

  // Listar todas as praias
  async getBeaches(params?: {
    state?: string;
    city?: string;
    region?: string;
    page?: number;
    page_size?: number;
  }): Promise<BeachListResponse> {
    const queryParams = new URLSearchParams();
    
    if (params?.state) queryParams.append("state", params.state);
    if (params?.city) queryParams.append("city", params.city);
    if (params?.region) queryParams.append("region", params.region);
    if (params?.page) queryParams.append("page", params.page.toString());
    if (params?.page_size) queryParams.append("page_size", params.page_size.toString());

    const query = queryParams.toString();
    return this.fetcher<BeachListResponse>(
      `/beaches${query ? `?${query}` : ""}`
    );
  }

  // Buscar praia por ID
  async getBeachById(beachId: string): Promise<Beach> {
    return this.fetcher<Beach>(`/beaches/${beachId}`);
  }

  // Buscar praias por estado
  async getBeachesByState(state: string): Promise<Beach[]> {
    return this.fetcher<Beach[]>(`/beaches/state/${state}`);
  }

  // Buscar praias por cidade
  async getBeachesByCity(city: string): Promise<Beach[]> {
    return this.fetcher<Beach[]>(`/beaches/city/${city}`);
  }

  // Buscar condições atuais de uma praia
  async getBeachConditions(beachId: string): Promise<BeachCondition> {
    return this.fetcher<BeachCondition>(`/conditions/${beachId}`);
  }

  // Buscar previsão de uma praia
  async getBeachForecast(
    beachId: string,
    days: number = 7
  ): Promise<BeachForecast> {
    return this.fetcher<BeachForecast>(
      `/conditions/${beachId}/forecast?days=${days}`
    );
  }

  // Health check
  async healthCheck(): Promise<{ status: string; database: string }> {
    return this.fetcher("/health");
  }
}

export const apiService = new ApiService();
