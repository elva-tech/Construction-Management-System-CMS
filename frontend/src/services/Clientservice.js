import apiService from "./apiService";

class ClientService {
  getAll() {
    return apiService.get("/api/v1/clients/all");
  }

  create(data) {
    return apiService.post("/api/v1/clients/create", data);
  }

  update(id, data) {
    return apiService.put(`/api/v1/clients/update/${id}`, data);
  }
}

export default new ClientService();