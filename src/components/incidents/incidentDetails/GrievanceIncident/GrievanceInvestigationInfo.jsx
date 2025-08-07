import Link from "next/link";
import { format, parseISO } from "date-fns";
import { File } from 'lucide-react';
import DateFormatter from "@/components/DateFormatter";

import "../../../../styles/_medication_details.scss"

const GrievanceInvestigationInfo = ({ data, incidentStatuses }) => {

  const formattedDate = (dateString) => {
    if (dateString) {
      const date = parseISO(dateString);
      return format(date, "MMM d, yyyy");
    } else {
      return "Not provided";
    }
  };
  return (
   <>
   {data ? (
     <div className="incident-details">
     <div className="number-mrn">
       <div className="phone-number">
         <small>Investigation conducted by</small>
         <h4>
           {data.conducted_by?.user?.last_name ||
           data.conducted_by?.user?.first_name
             ? `${data.conducted_by?.user?.last_name} ${data.conducted_by?.user?.first_name}`
             : "Not provided"}
         </h4>
       </div>
       <div className="phone-number">
         <small>Start Date</small>
         <h4>
           <DateFormatter dateString={data.start_date} />
         </h4>
       </div>
       <div className="phone-number">
         <small>End date</small>
         <h4>
           <DateFormatter dateString={data.end_date} />
         </h4>
       </div>
     </div>

     <div className="number-mrn">
       <div className="field small-field">
         <label htmlFor="city">Interviews</label>
         <h4>{data.interviews_findings || "Not provided"}</h4>
       </div>
       <div className="field small-field">
         <label htmlFor="city"> Medical record findings</label>
         <h4>{data.medical_record_findings || "Not provided"}</h4>
       </div>
     </div>
     <div className="number-mrn">
       <div className="field small-field">
         <label htmlFor="city">Other observations/findings</label>
         <h4>{data.findings || "Not provided"}</h4>
       </div>
       <div className="field small-field">
         <label htmlFor="city">Conclusion</label>
         <h4>{data.conclusion || "Not provided"}</h4>
       </div>
     </div>
     <div className="number-mrn">
       <div className="field small-field">
         <label htmlFor="city">Actions taken</label>
         <h4>{data.action_taken || "Not provided"}</h4>
       </div>
     </div>
     <div className="number-mrn">
       <div className="field small-field">
         <label htmlFor="city">Feedback</label>
         <h4>{data.feedback || "Not provided"}</h4>
       </div>
       <div className="field small-field">
         <label htmlFor="city">Date of feedback</label>
         <h4>
           <DateFormatter dateString={data.date_of_feedback} />
         </h4>
       </div>
     </div>

     <div className="number-mrn">
       <div className="phone-number">
         <small>Date extension letter sent to patient and/or family</small>
         <h4>
           <DateFormatter dateString={data.date_extension_letter_sent} />
         </h4>
       </div>
       <div className="phone-number">
         <small>Copy of letter and certified receipt received</small>
         {data.extension_letter_copy ? (
           <Link
             className="document-link"
             to={data.extension_letter_copy.file}
             target="_blank"
             download
           >
             <div className="row">
               <File className="document-icon" />
               <div className="col">
                 <h4>{data.extension_letter_copy.name}</h4>
                 <span>
                   Added on {formattedDate(data.date_extension_letter_sent)}{" "}
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
           <DateFormatter dateString={data.date_response_letter_sent} />
         </h4>
       </div>
       <div className="phone-number">
         <small>Copy of response letter</small>
         {data.response_letter_copy ? (
           <Link
             className="document-link"
             to={data.response_letter_copy.file}
             target="_blank"
             download
           >
             <div className="row">
               <File className="document-icon" />
               <div className="col">
                 <h4>{data.response_letter_copy.name}</h4>
                 <span>
                   Added on {formattedDate(data.date_response_letter_sent)}{" "}
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
         <h4>{data.matter_closed ? "Yes" : "No"}</h4>
       </div>
       <div className="phone-number">
         <small>Date when matter closed:</small>
         <h4>
           <DateFormatter dateString={data.date_matter_closed} />
         </h4>
       </div>
       <div className="phone-number">
         <small>Grievance report</small>
         <h4>
           <DateFormatter dateString={data.date_matter_closed} />
         </h4>
       </div>
     </div>
   </div>
   ) : (
    <h4>Grievance investigation not found for this incident!!</h4>
   )}
   </>
  );
};

export default GrievanceInvestigationInfo;
