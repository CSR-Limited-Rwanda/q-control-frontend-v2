import Link from "next/link";
import { format, parseISO } from "date-fns";
import { File } from "lucide-react";
import DateFormatter from "@/components/DateFormatter";

import "../../../../styles/_medication_details.scss";
import { useEffect } from "react";

const GrievanceInvestigationInfo = ({ data, incidentStatuses }) => {
  const formattedDate = (dateString) => {
    if (dateString) {
      const date = parseISO(dateString);
      return format(date, "MMM d, yyyy");
    } else {
      return "Not provided";
    }
  };

  useEffect(() => {
    console.log(data);
  }, []);
  return data.lenght > 0 ? (
    <>
      {data.map((investigation, index) => (
        <div key={index} className="incident-details">
          <div className="number-mrn">
            <div className="phone-number">
              <small>Investigation conducted by</small>
              <h4>
                {investigation.conducted_by?.last_name ||
                investigation.conducted_by?.first_name
                  ? `${investigation.conducted_by?.last_name} ${investigation.conducted_by?.first_name}`
                  : "Not provided"}
              </h4>
            </div>
            <div className="phone-number">
              <small>Start Date</small>
              <h4>
                <DateFormatter dateString={investigation.start_date} />
              </h4>
            </div>
            <div className="phone-number">
              <small>End date</small>
              <h4>
                <DateFormatter dateString={investigation.end_date} />
              </h4>
            </div>
          </div>

          <div className="number-mrn">
            <div className="field small-field">
              <label htmlFor="city">Interviews</label>
              <h4>{investigation.interviews_findings || "Not provided"}</h4>
            </div>
            <div className="field small-field">
              <label htmlFor="city"> Medical record findings</label>
              <h4>{investigation.medical_record_findings || "Not provided"}</h4>
            </div>
          </div>
          <div className="number-mrn">
            <div className="field small-field">
              <label htmlFor="city">Other observations/findings</label>
              <h4>{investigation.findings || "Not provided"}</h4>
            </div>
            <div className="field small-field">
              <label htmlFor="city">Conclusion</label>
              <h4>{investigation.conclusion || "Not provided"}</h4>
            </div>
          </div>
          <div className="number-mrn">
            <div className="field small-field">
              <label htmlFor="city">Actions taken</label>
              <h4>{investigation.action_taken || "Not provided"}</h4>
            </div>
          </div>
          <div className="number-mrn">
            <div className="field small-field">
              <label htmlFor="city">Feedback</label>
              <h4>{investigation.feedback || "Not provided"}</h4>
            </div>
            <div className="field small-field">
              <label htmlFor="city">Date of feedback</label>
              <h4>
                <DateFormatter dateString={investigation.date_of_feedback} />
              </h4>
            </div>
          </div>

          <div className="number-mrn">
            <div className="phone-number">
              <small>Date extension letter sent to patient and/or family</small>
              <h4>
                <DateFormatter
                  dateString={investigation.date_extension_letter_sent}
                />
              </h4>
            </div>
            <div className="phone-number">
              <small>Copy of letter and certified receipt received</small>
              {investigation.extension_letter_copy ? (
                <Link
                  className="document-link"
                  to={investigation.extension_letter_copy.file}
                  target="_blank"
                  download
                >
                  <div className="row">
                    <File className="document-icon" />
                    <div className="col">
                      <h4>{data.extension_letter_copy.name}</h4>
                      <span>
                        Added on{" "}
                        {formattedDate(
                          investigation.date_extension_letter_sent
                        )}{" "}
                      </span>
                    </div>
                  </div>
                </Link>
              ) : (
                <small>No Extension letter copy</small>
              )}
            </div>
          </div>

          <div className="number-mrn">
            <div className="phone-number">
              <small>
                Date written response letter sent to patient and/or family
              </small>
              <h4>
                {" "}
                <DateFormatter
                  dateString={investigation.date_response_letter_sent}
                />
              </h4>
            </div>
            <div className="phone-number">
              <small>Copy of response letter</small>
              {data.response_letter_copy ? (
                <Link
                  className="document-link"
                  to={investigation.response_letter_copy.file}
                  target="_blank"
                  download
                >
                  <div className="row">
                    <File className="document-icon" />
                    <div className="col">
                      <h4>{investigation.response_letter_copy.name}</h4>
                      <span>
                        Added on{" "}
                        {formattedDate(investigation.date_response_letter_sent)}{" "}
                      </span>
                    </div>
                  </div>
                </Link>
              ) : (
                <small>No response letter copy</small>
              )}
            </div>
          </div>

          <div className="number-mrn">
            <div className="phone-number">
              <small>Matter closed:</small>
              <h4>{investigation.matter_closed ? "Yes" : "No"}</h4>
            </div>
            <div className="phone-number">
              <small>Date when matter closed:</small>
              <h4>
                <DateFormatter dateString={investigation.date_matter_closed} />
              </h4>
            </div>
            <div className="phone-number">
              <small>Grievance report</small>
              <h4>{investigation.grievance_report.id}</h4>
            </div>
          </div>
        </div>
      ))}
    </>
  ) : (
    "No investigation has been added to this incident."
  );
};

export default GrievanceInvestigationInfo;
