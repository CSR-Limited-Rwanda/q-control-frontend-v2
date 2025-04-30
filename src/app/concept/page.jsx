'use client'
import styles from '@/styles/styles.module.css'
import DashboardLayout from '../dashboard/layout'

export default function QualityControlSystem() {
    return (
        <DashboardLayout>
            <div className={styles.container}>
                <h1 className={styles.title}>Quality Control System Concept and User Stories</h1>

                <section className={styles.section}>
                    <h2 className={styles.sectionTitle}>Concept Overview</h2>
                    <p>
                        The Quality Control System is a web-based platform designed for healthcare facilities to streamline the reporting, tracking, and resolution of incidents, such as patient safety events, staff incidents, medication errors, and workplace violence. The system supports a role-based access control (RBAC) model to ensure that end users, from frontline staff to administrators, have appropriate access to functionalities based on their roles and assigned facilities. The Quality Control System aims to improve compliance, enhance safety, and facilitate efficient communication across departments. It includes customizable and uncustomizable end-user roles, with a strong recommendation to stick to default roles for consistency and security.
                    </p>
                    <p>Key features include:</p>
                    <ul className={styles.list}>
                        <li><strong>Incident Reporting</strong>: End users can draft, create, submit, and manage incident reports with supporting documentation.</li>
                        <li><strong>Role-Based Permissions</strong>: Permissions vary by end-user role (e.g., Super User, Admin, Manager, Director, User Editor, User) and are restricted by department, facility, or access to sensitive information.</li>
                        <li><strong>Dashboards and Logs</strong>: Provide insights into incident trends and statuses, accessible based on end-user role permissions.</li>
                        <li><strong>Notifications and Alerts</strong>: Notify end users of actions like incident submission, review, modification, or user account changes.</li>
                        <li><strong>User Management</strong>: Allows authorized end users to create, edit, and deactivate user accounts within the application.</li>
                        <li><strong>Restricted Information Access</strong>: Controlled by Admin or Super User end users to ensure sensitive data is protected.</li>
                    </ul>
                    <h3 className={styles.storyTitle}>Notifications</h3>
                    <p>
                        The system sends notifications to end users based on their roles and the actions performed. Common actions (create, read, update, delete) trigger notifications for incident reports and user accounts. Incident-specific actions include submit, send for review, add severity rating, add review, modify, close, and reopen. Notifications are delivered via in-app alerts or emails and are configurable by Super User end users within the application.
                    </p>
                    <p>The system emphasizes usability, security, and scalability, ensuring healthcare facilities can manage incidents effectively while adhering to regulatory requirements. Technical tasks, such as system infrastructure or database management, are handled by separate technical staff, not end users.</p>
                </section>

                <section className={styles.section}>
                    <h2 className={styles.sectionTitle}>User Stories</h2>

                    <div className={styles.story}>
                        <h3 className={styles.storyTitle}>1. Super User Configures the Application</h3>
                        <p><strong>As a Super User</strong>, an end user with full access, I want to configure application settings and manage user accounts across all facilities within the Quality Control System, so that the system aligns with our organizational needs and maintains security.</p>
                        <ul className={styles.list}>
                            <li>I can access the Application Design and Configuration modules to customize department settings and guest access within the system’s UI.</li>
                            <li>I can create, update, and deactivate end-user accounts for any role across all facilities, receiving notifications for these actions.</li>
                            <li>I can view and export all incident reports, logs, and dashboards for any facility.</li>
                            <li>I receive notifications for all incident actions (submit, review, modify, close, reopen) and user account actions (create, update, delete).</li>
                            <li>Changes I make are logged and auditable within the application.</li>
                            <li>I receive notifications when system backups are completed or fail, as provided by the application’s interface.</li>
                        </ul>
                        <div className={styles.example}>
                            <p><strong>Example Scenario</strong>: Jane, a Super User, logs into the Quality Control System to update department settings for a new facility using the application’s configuration interface. She receives a notification when she creates accounts for new Admins, ensuring they have appropriate access. She gets alerted when a new incident is submitted and exports a dashboard report to review trends across facilities.</p>
                        </div>
                    </div>

                    <hr className={styles.divider} />

                    <div className={styles.story}>
                        <h3 className={styles.storyTitle}>2. Admin Manages Incident Reports and Assigns Access</h3>
                        <p><strong>As an Admin</strong>, an end user responsible for quality management, I want to manage incident reports and control access to restricted information within the Quality Control System, so that sensitive data is secure and reports are handled efficiently.</p>
                        <ul className={styles.list}>
                            <li>I can view, modify, and export all incident reports, investigations, and logs for my assigned facility.</li>
                            <li>I can send reports for review, add severity ratings, and add reviews, receiving notifications for these actions.</li>
                            <li>I can grant access to restricted information for specific Managers or Directors, with notifications sent to them.</li>
                            <li>I receive notifications when new reports are submitted, modified, reviewed, closed, or reopened in my facility.</li>
                            <li>I cannot modify application design or configuration settings, as these are handled by Super Users.</li>
                        </ul>
                        <div className={styles.example}>
                            <p><strong>Example Scenario</strong>: Tom, an Admin in the Quality Department, receives a notification about a new medication error report. He sends it for review, assigns a severity rating, and gets notified when the Pharmacy Department Manager adds a review. He grants access to the Manager and exports a log of medication errors for a monthly review.</p>
                        </div>
                    </div>

                    <hr className={styles.divider} />

                    <div className={styles.story}>
                        <h3 className={styles.storyTitle}>3. Manager Submits and Reviews Department-Specific Reports</h3>
                        <p><strong>As a Manager</strong>, an end user overseeing a department, I want to create and review incident reports for my department within the Quality Control System, so that I can address issues promptly and comply with facility protocols.</p>
                        <ul className={styles.list}>
                            <li>I can draft, create, submit, and modify incident reports for my assigned department, receiving confirmation notifications.</li>
                            <li>I can view unrestricted reports, logs, and dashboards for my department.</li>
                            <li>I can access restricted reports only with Admin approval, with notifications when access is granted.</li>
                            <li>I receive notifications when reports are submitted, sent for review, modified, reviewed, closed, or reopened in my department.</li>
                            <li>I cannot edit user accounts or access application configuration settings.</li>
                        </ul>
                        <div className={styles.example}>
                            <p><strong>Example Scenario</strong>: Sarah, a Manager in the HR Department, submits a workplace violence report and receives a confirmation notification. She gets notified when the Admin grants her access to a restricted investigation report and when a review is added. She submits feedback to Quality/Risk Management.</p>
                        </div>
                    </div>

                    <hr className={styles.divider} />

                    <div className={styles.story}>
                        <h3 className={styles.storyTitle}>4. Director Monitors Department Incidents</h3>
                        <p><strong>As a Director</strong>, an end user with oversight responsibilities, I want to view read-only incident reports and dashboards for my department within the Quality Control System, so that I can stay informed about safety trends without modifying data.</p>
                        <ul className={styles.list}>
                            <li>I can access read-only reports, logs, and dashboards for my assigned department.</li>
                            <li>I can view restricted information only with Admin approval, with notifications when access is granted.</li>
                            <li>I cannot modify or delete reports.</li>
                            <li>I can export dashboards for reporting purposes.</li>
                            <li>I receive notifications for critical incidents (e.g., submission, review, closure) in my department.</li>
                        </ul>
                        <div className={styles.example}>
                            <p><strong>Example Scenario</strong>: Dr. Lee, a Director in the Pharmacy Department, receives a notification about a critical medication error report. He accesses the Quality Control System dashboard to review trends, gets notified when granted access to a restricted report, and exports the dashboard for a board meeting.</p>
                        </div>
                    </div>

                    <hr className={styles.divider} />

                    <div className={styles.story}>
                        <h3 className={styles.storyTitle}>5. User Editor Manages User Accounts</h3>
                        <p><strong>As a User Editor</strong>, an end user responsible for account management, I want to manage user accounts within the Quality Control System without accessing incident data, so that I can maintain an up-to-date user directory securely.</p>
                        <ul className={styles.list}>
                            <li>I can create, edit, and deactivate end-user accounts, receiving notifications for these actions.</li>
                            <li>I can submit incident reports if needed, with confirmation notifications.</li>
                            <li>I cannot view, modify, or export incident reports, logs, or dashboards.</li>
                            <li>I cannot access application design or configuration settings.</li>
                            <li>My actions are logged for auditing within the application.</li>
                        </ul>
                        <div className={styles.example}>
                            <p><strong>Example Scenario</strong>: Mike, a User Editor, creates accounts for new nurses and receives a notification confirming the action. He deactivates accounts for departed staff and submits a lost and found report, getting a confirmation, but cannot view incident logs or dashboards.</p>
                        </div>
                    </div>

                    <hr className={styles.divider} />

                    <div className={styles.story}>
                        <h3 className={styles.storyTitle}>6. User Submits an Incident Report</h3>
                        <p><strong>As a User</strong>, an end user with basic access, I want to submit incident reports easily within the Quality Control System, so that I can report issues quickly without accessing sensitive data.</p>
                        <ul className={styles.list}>
                            <li>I can draft, create, and submit incident reports with uploaded documentation, receiving confirmation notifications.</li>
                            <li>I cannot view, modify, delete, or export reports, logs, or dashboards.</li>
                            <li>I receive notifications when my report is sent for review, reviewed, or closed.</li>
                            <li>I cannot close or reopen my own incident report.</li>
                            <li>My access is limited to report submission functionalities.</li>
                        </ul>
                        <div className={styles.example}>
                            <p><strong>Example Scenario</strong>: Emily, a nurse, submits a patient fall report through the Quality Control System, uploading a photo and receiving a confirmation notification. She gets notified when the report is sent for review and when it’s closed, but cannot view its status or other reports.</p>
                        </div>
                    </div>

                    <hr className={styles.divider} />

                    <div className={styles.story}>
                        <h3 className={styles.storyTitle}>7. Employee Health Dept Head Accesses Staff Incident Logs</h3>
                        <p><strong>As an Employee Health Department Head (Manager role)</strong>, an end user overseeing staff safety, I want to access a log of staff incidents at my facility within the Quality Control System, so that I can monitor workplace safety.</p>
                        <ul className={styles.list}>
                            <li>I can view a log of staff incidents and investigations for my assigned facility.</li>
                            <li>I can access restricted staff incident reports with Admin approval, with notifications when access is granted.</li>
                            <li>I can submit staff incident reports, receiving confirmation notifications.</li>
                            <li>I receive notifications when staff incident reports are submitted, sent for review, modified, reviewed, closed, or reopened in my facility.</li>
                            <li>My access is limited to staff-related incidents and does not include other report types.</li>
                        </ul>
                        <div className={styles.example}>
                            <p><strong>Example Scenario</strong>: Rachel, the Employee Health Department Head, receives a notification about a new staff needlestick report. She reviews the log of staff incidents, gets notified when granted access to a restricted report, and submits a new report, receiving a confirmation.</p>
                        </div>
                    </div>
                </section>

                <section className={styles.notes}>
                    <h2 className={styles.sectionTitle}>Notes</h2>
                    <ul className={styles.list}>
                        <li><strong>Default Roles</strong>: End users are encouraged to use default roles (Super User, Admin, Profile Editor, Department Admin, User) for consistency and security. Custom roles should be used sparingly with clear documentation.</li>
                        <li><strong>Multi-Facility Access</strong>: End users can have a primary facility and role but may have additional roles in other facilities, with permissions and notifications applied accordingly.</li>
                        <li><strong>Restricted Information</strong>: Access to sensitive data requires approval from Admin or Super User end users, with notifications sent to relevant users.</li>
                        <li><strong>Notification Configuration</strong>: Super User end users can configure notification settings (e.g., in-app alerts, email preferences) within the application’s UI.</li>
                        <li><strong>Backend Implementation</strong>: Incident actions (e.g., closing, reopening) and notifications are handled on the backend to enforce rules (e.g., end users cannot close their own reports).</li>
                        <li><strong>Technical Management</strong>: Technical tasks, such as system infrastructure and database management, are handled by separate technical staff, not end users of the Quality Control System.</li>
                    </ul>
                </section>
            </div>
        </DashboardLayout>
    );
}