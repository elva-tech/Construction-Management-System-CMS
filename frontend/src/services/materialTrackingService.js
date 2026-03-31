import apiService from "./apiService";

class MaterialTrackingService {
  getAll(projectId) {
    const query = projectId ? `?project_id=${projectId}` : '';
    return apiService.get(`/api/v1/material-tracking/all${query}`);
  }

  create(data) {
    return apiService.post("/api/v1/material-tracking/create", data);
  }

  update(id, data) {
    return apiService.put(`/api/v1/material-tracking/update/${id}`, data);
  }
}

export default new MaterialTrackingService();