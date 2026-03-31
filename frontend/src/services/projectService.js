import apiService from "./apiService";

class ProjectService {
  getAll() {
    return apiService.get("/api/v1/projects/all");
  }

  getById(id) {
    return apiService.get(`/api/v1/projects/id/${id}`);
  }

  create(data) {
    return apiService.post("/api/v1/projects/create", data);
  }

  update(id, data) {
    return apiService.put(`/api/v1/projects/update/${id}`, data);
  }

  delete(id) {
    return apiService.delete(`/api/v1/projects/delete/${id}`);
  }
}

export default new ProjectService();