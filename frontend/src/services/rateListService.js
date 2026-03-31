import apiService from "./apiService";

class RateListService {
  getAll(projectId) {
    const query = projectId ? `?project_id=${projectId}` : '';
    return apiService.get(`/api/v1/rate-lists/all${query}`);
  }

  create(data) {
    return apiService.post("/api/v1/rate-lists/create", data);
  }

  update(id, data) {
    return apiService.put(`/api/v1/rate-lists/update/${id}`, data);
  }
}

export default new RateListService();