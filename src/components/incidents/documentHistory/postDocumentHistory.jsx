import api, {API_URL} from "@/utils/api";
function postDocumentHistory(incidentId, description, action) {
    function getBrowserName() {
      const userAgent = navigator.userAgent;
  
      if (userAgent.includes("Chrome") && !userAgent.includes("Edg")) {
        return "Chrome";
      } else if (userAgent.includes("Firefox")) {
        return "Firefox";
      } else if (userAgent.includes("Safari") && !userAgent.includes("Chrome")) {
        return "Safari";
      } else if (userAgent.includes("Edge")) {
        return "Edge";
      } else if (userAgent.includes("OPR") || userAgent.includes("Opera")) {
        return "Opera";
      } else if (userAgent.includes("Trident") || userAgent.includes("MSIE")) {
        return "Internet Explorer";
      } else {
        return "Unknown Browser";
      }
    }
  
    async function submitDocumentData() {
      try {
        // Fetch IP address
        const response = await fetch("https://api.ipify.org?format=json");
        const data = await response.json();
        const ipAddress = data.ip;
  
        // Create a new activity
        const apiResponse = await api.post(`${API_URL}/activities/new/`, {
          action: action,
          ip_address: ipAddress,
          user_agent: getBrowserName(),
          description: description,
          incident_id: incidentId,
        });

      } catch (error) {

      }
    }
  
    submitDocumentData();
  }
  
  export default postDocumentHistory;