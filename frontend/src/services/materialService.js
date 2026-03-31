import apiService from "./apiService";

class MaterialService {
  getAll(projectId) {
    const query = projectId ? `?project_id=${projectId}` : '';
    return apiService.get(`/api/v1/materials/all${query}`);
  }

  create(data) {
    return apiService.post("/api/v1/materials/create", data);
  }

  update(id, data) {
    return apiService.put(`/api/v1/materials/update/${id}`, data);
  }
}

export default new MaterialService();