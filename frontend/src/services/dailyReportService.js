import apiService from "./apiService";

class DailyReportService {
  getAll(projectId) {
    const query = projectId ? `?project_id=${projectId}` : '';
    return apiService.get(`/api/v1/dailyReports/all${query}`);
  }

  create(data) {
    return apiService.post("/api/v1/dailyReports/create", data);
  }

  update(id, data) {
    return apiService.put(`/api/v1/dailyReports/update/${id}`, data);
  }
}

export default new DailyReportService();