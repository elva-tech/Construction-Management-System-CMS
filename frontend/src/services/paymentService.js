//client side payment service

import apiService from "./apiService";

class PaymentService {
  getAll() {
    return apiService.get("/api/v1/payments/all");
  }

  getByProject(projectId) {
    return apiService.get(`/api/v1/payments/project/${projectId}`);
  }

  create(data) {
    return apiService.post("/api/v1/payments/create", data);
  }

  update(id, data) {
    return apiService.put(`/api/v1/payments/update/${id}`, data);
  }

  delete(id) {
    return apiService.delete(`/api/v1/payments/delete/${id}`);
  }
}

export default new PaymentService();