//client side payment plan service

import apiService from "./apiService";

class PaymentPlanService {
  getAll() {
    return apiService.get("/api/v1/payment-plans/all");
  }

  create(data) {
    return apiService.post("/api/v1/payment-plans/create", data);
  }

  update(id, data) {
    return apiService.put(`/api/v1/payment-plans/update/${id}`, data);
  }
}

export default new PaymentPlanService();