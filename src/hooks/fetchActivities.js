import api from "@/utils/api";

export const fetchActivities = async (id, type) => {
  try {
    const response = await api.get(
      `/activities/list/${id}/?incident_type=${type}`
    );
    // console.log('activities:', response)

    if (response.status === 200) {
      const { data = [], count } = response.data;

      const activities = data.map((a) => ({
        id: a.id,
        incident: a.incident ?? id,
        activity_message: a.activity_message ?? "",
        activity_highlight: Array.isArray(a.activity_highlight)
          ? a.activity_highlight.length > 0
            ? {
                id: a.activity_highlight[0]?.id ?? null,
                name: a.activity_highlight[0]?.name ?? "",
              }
            : null
          : a.activity_highlight
          ? {
              id: a.activity_highlight.id ?? null,
              name: a.activity_highlight.name ?? "",
            }
          : null,
        activity_date: a.activity_date ?? null,
        destination: Array.isArray(a.destination)
          ? a.destination.length > 0
            ? {
                id: a.destination[0]?.id ?? null,
                name: a.destination[0]?.name ?? "",
              }
            : null
          : a.destination
          ? {
              id: a.destination.id ?? null,
              name: a.destination.name ?? "",
            }
          : null,
        files: Array.isArray(a.files)
          ? a.files.map((f) => ({
              name: f.name ?? "",
              url: f.document_url ?? "",
              id: f.document_id ?? null,
              file_type: f.file_type ?? null,
            }))
          : [],
        created_by: {
          id: a.created_by?.id ?? null,
          first_name: a.created_by?.first_name ?? "",
          last_name: a.created_by?.last_name ?? "",
          position: a.created_by?.position ?? null,
        },
        activity_type: a.activity_type ?? "",
      }));
      return {
        success: true,
        data: activities,
        count: count ?? activities.length,
      };
    } else {
      return {
        success: false,
        message: "Failed to fetch activities.",
      };
    }
  } catch (error) {
    let errorMessage = "An error occurred while fetching activities.";
    if (error.response && error.response.data) {
      errorMessage = error.response.data.error || errorMessage;
    }
    return {
      success: false,
      message: errorMessage,
    };
  }
};
