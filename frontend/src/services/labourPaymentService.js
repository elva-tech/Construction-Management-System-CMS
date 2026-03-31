import apiService from "./apiService";

class LabourPaymentService {
  getAll(projectId) {
    const query = projectId ? `?project_id=${projectId}` : '';
    return apiService.get(`/api/v1/labour-payments/${query}`);
  }

  create(data) {
    return apiService.post("/api/v1/labour-payments/", data);
  }
}

export default new LabourPaymentService();