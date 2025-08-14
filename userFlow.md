# Comprehensive User Roles and Permissions Documentation

**Last Updated: August 12, 2025**

---

## **1. Role Definitions and Key Permissions**

### **A. Standard Roles**

| Role                     | Key Permissions                                                                                                                        | Restrictions                                                              |
| ------------------------ | -------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------- |
| **User**                 | • Draft/submit incident reports <br> • Upload documents <br> • View drafts and own reports                                             | • No access to others' reports <br> • No modification/deletion rights     |
| **Manager**              | • Access unrestricted incidents in assigned dept <br> • Add reviews, send to Quality/Risk <br> • List logs (limited), export dept logs | • Cannot close incidents <br> • No restricted info without approval       |
| **Director**             | • Read-only access to facility/dept incidents <br> • View dashboards/logs, export data                                                 | • No editing/modification rights <br> • Restricted info requires approval |
| **Admin**                | • Full access to facility incidents <br> • Modify reports, send to dept <br> • Export logs, manage user accounts                       | • Cannot close own incidents <br> • Facility-bound                        |
| **Quality/Risk Manager** | • Full access to all facilities’ incidents <br> • Modify, add severity, close (except own) <br> • Assign restricted access             | • Cannot close own incidents                                              |
| **Super User**           | • Full access across all facilities <br> • Delete/modify reports/users <br> • Configure settings/backups                               | None                                                                      |
| **User Editor**          | • Create/edit/deactivate user accounts <br> • Submit own reports                                                                       | • No access to reports/logs/dashboards                                    |

---

## **2. Incident Report Types & Department-Specific Access**

| Report Type                                   | Accessible To  | Special Permissions                   |
| --------------------------------------------- | -------------- | ------------------------------------- |
| General Patient/Visitor                       | All Users      | Super User/Admin/Manager: Full rights |
| Staff Incident                                | All Users      | Employee Health Dept Head: Log access |
| Staff Incident Investigation                  | All Users      | Manager-level access                  |
| Medication Error/Near Miss                    | All Users      | Pharmacy Dept Managers: Review rights |
| ADR Reports                                   | All Users      | Pharmacy Dept Managers: Review rights |
| Workplace Violence                            | All Users      | HR Dept Managers: Additional rights   |
| Lost and Found                                | All Users      | Super User/Admin/Manager: Full rights |
| Grievance                                     | All Users      | Super User/Admin: Full rights         |
| Grievance Investigation                       | All Users      | Super User/Admin: Full rights         |
| Restricted Reports (e.g., Workplace Violence) | Admin-approved | Requires explicit access grant        |

---

## **3. Detailed User Flows**

### **Normal User**

1. **Login** → Access profile/dashboard.
2. **Submit Incident** → Draft, attach files, submit.
3. **Submit Complaint**
4. **View Reports** → See drafts and own submissions (no edits).

### **Manager**

1. **Login** → Follow Normal User steps.
2. **Department View** → See unrestricted incidents in assigned dept.
3. **Review/Forward** → Add comments, send to Quality/Risk (no close).
4. **Logs/Export** → List limited logs, export dept data.

### **Director**

1. **Login** → Follow Normal User steps.
2. **Facility View** → Read-only access to all facility incidents.
3. **Dashboards/Logs** → Export data (read-only).

### **Admin**

1. **Login** → Follow User + Manager + Director steps.
2. **Modify Incidents** → Edit, send to dept, export logs.
3. **User Management** → Create/edit/deactivate accounts.
4. **Restricted Access** → Grant/revoke permissions.

### **Quality/Risk Manager**

1. **Login** → Follow all prior steps.
2. **Global View** → Access all facilities’ incidents.
3. **Actions** → Modify, add severity, close (except own), assign access.

### **Super User**

1. **Login** → Full system access.
2. **Global Actions** → Delete reports, configure settings/backups.
3. **User Management** → Create/edit/delete all users.

### **User Editor**

1. **Login** → Access user management panel.
2. **Account Actions** → Create/edit/deactivate users.

---

## **4. Critical Notes & Edge Cases**

- **No Self-Closing**: System-enforced; users cannot close their own incidents.
- **Restricted Info**: Requires Admin approval via permission request.
- **Dept-Specific Rights**: Pharmacy/HR Managers have elevated access (e.g., Medication Errors, Workplace Violence).
- **Super User Override**: Only role with deletion and cross-facility rights.

---

## **5. Visual Permissions Matrix**

| Role                 | Create | Read | Update | Delete | Export  | Send to Dept |
| -------------------- | ------ | ---- | ------ | ------ | ------- | ------------ |
| User                 | Yes    | Own  | No     | No     | No      | No           |
| Manager              | Yes    | Dept | Yes    | No     | Limited | Yes          |
| Director             | Yes    | All  | No     | No     | Yes     | No           |
| Admin                | Yes    | All  | Yes    | No     | Yes     | Yes          |
| Quality/Risk Manager | Yes    | All  | Yes    | No     | Yes     | Yes          |
| Super User           | Yes    | All  | Yes    | Yes    | Yes     | Yes          |
| User Editor          | Yes    | No   | No     | No     | No      | No           |

---
