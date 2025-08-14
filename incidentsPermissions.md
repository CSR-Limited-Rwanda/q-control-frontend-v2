# IncidentPermissionsService Documentation

This service handles permission checking for incident operations in the quality control system.

## Overview

The `IncidentPermissionsService` class provides methods to check if a user has permission to perform various operations on incidents, including creating, viewing, modifying, deleting, and managing incident workflows.

## Constructor

```python
IncidentPermissionsService(user: Type[User], app_label: str, incident=None)
```

Initialize the service with:

- `user`: Django User object whose permissions will be checked
- `app_label`: The application label for permission checking (e.g., "general_patient_visitor")
- `incident`: Optional incident object for operations requiring a specific incident

## Methods

### can_create_incident()

**Purpose:** Checks if a user can create new incidents

**Returns:** RepositoryResponse with success status and message

**Conditions:**

- User must be active (is_active=True)
- Any authenticated active user can create incidents (no additional role restrictions)

**Success Message:** "User can create incidents"

**Failure Message:** "User cannot create incidents, account is not active"

---

### can_view_incident()

**Purpose:** Checks if a user can view a specific incident

**Returns:** RepositoryResponse with success status and message

**Conditions:**

- User must be logged in
- **ANY ONE** of the following conditions must be met:
     - User must be the owner of the incident (created_by)
     - User's profile is in any review_task.reviewers (direct reviewer assignment)
     - User's profile is in any review_task.review_groups.members (group member assignment)
     - User has explicit permission: `{app_label}.view_details`
     - User is in authorized role with facility access: [Super user, Admin, Quality/Risk manager]

**Success Messages:**

- "User is owner of incident"
- "User is assigned to review tasks"
- "User has explicit view permission"
- "User has role-based access"

**Failure Messages:**

- "Incident or user who created it is not found"
- "Incident not found"
- "You do not have permission to view this incident"

---

### can_modify_incident()

**Purpose:** Checks if a user can modify/edit a specific incident

**Returns:** RepositoryResponse with success status and message

**Conditions:**

- **ANY ONE** of the following conditions must be met:
     - User's profile is in any review_task.reviewers (direct reviewer assignment)
     - User's profile is in any review_task.review_groups.members (group member assignment)
     - User has explicit permission: `{app_label}.change_incident`
     - User is in authorized role with facility access: [Super user, Admin, Quality/Risk manager, Manager]

**Special Restrictions (per userFlow.md):**

- **Directors have read-only access** and cannot modify incidents
- **Regular users cannot modify incidents**, even their own (unless assigned as reviewers)

**Success Messages:**

- "User is assigned to review tasks"
- "User has explicit modify permission"
- "User has role-based access"

**Failure Messages:**

- "Incident not found"
- "Directors have read-only access and cannot modify incidents"
- "Regular users cannot modify incidents, even their own reports"
- "You do not have permission to modify this incident"

---

### can_delete_incident()

**Purpose:** Checks if a user can delete a specific incident

**Returns:** RepositoryResponse with success status and message

**Conditions:**

- **ONLY** Super users can delete incidents
- User must be in group: "Super user"

**Success Message:** "Super user can delete incidents"

**Failure Messages:**

- "Incident not found"
- "Only Super users can delete incidents"

---

### can_list_incidents()

**Purpose:** Checks if a user can list/view incident collections

**Returns:** RepositoryResponse with success status and message

**Conditions:**

- **ANY ONE** of the following conditions must be met:
     - User has explicit permission: `{app_label}.view_list`
     - User is in authorized role: [Super user, Admin, Quality/Risk manager, Manager]
     - Default: authenticated users can list their own incidents

**Success Messages:**

- "User has explicit list permission"
- "User has role-based access"
- "User can list their own incidents"

---

### can_send_to_department()

**Purpose:** Checks if a user can send an incident to a department

**Returns:** RepositoryResponse with success status and message

**Conditions:**

- Quality/Risk managers and Admins can send incidents to departments
- User must be in group: "Quality/Risk manager" OR "Admin"

**Success Message:** "User can send incident to department"

**Failure Messages:**

- "Incident not found"
- "Only Quality/Risk managers and Admins can send incidents to departments"

---

### can_add_review()

**Purpose:** Checks if a user can add reviews to a specific incident

**Returns:** RepositoryResponse with success status and message

**Conditions:**

- **ANY ONE** of the following conditions must be met:
     - User's profile is in any review_task.reviewers (direct reviewer assignment)
     - User's profile is in any review_task.review_groups.members (group member assignment)
     - User has explicit permission: `{app_label}.add_review`
     - User is in authorized role with facility access: [Super user, Admin, Quality/Risk manager, Manager]

**Special Restrictions (per userFlow.md):**

- **Directors have read-only access** and cannot add reviews
- **Regular users cannot add reviews** to incidents, even their own (unless assigned as reviewers)

**Success Messages:**

- "User is assigned to review tasks"
- "User has explicit add review permission"
- "User has role-based access"

**Failure Messages:**

- "Incident not found"
- "Directors have read-only access and cannot add reviews"
- "Regular users cannot add reviews to incidents"
- "You do not have permission to add reviews to this incident"

---

### can_add_severity_rating()

**Purpose:** Checks if a user can add severity ratings to a specific incident

**Returns:** RepositoryResponse with success status and message

**Conditions:**

- **ONLY** Quality/Risk managers can add severity ratings
- User must be in group: "Quality/Risk manager"

**Special Restrictions (per userFlow.md):**

- **Managers cannot add severity ratings** (restricted action)

**Success Message:** "Quality/Risk manager can add severity rating"

**Failure Messages:**

- "Incident not found"
- "Managers cannot add severity ratings (restricted action)"
- "Only Quality/Risk managers can add severity ratings"

---

### can_mark_as_resolved()

**Purpose:** Checks if a user can mark an incident as resolved

**Returns:** RepositoryResponse with success status and message

**Conditions:**

- **ONLY** Quality/Risk managers can mark incidents as resolved
- User must be in group: "Quality/Risk manager"

**Special Restrictions (per userFlow.md):**

- **System-enforced rule:** Users cannot close their own incidents (no self-closing)

**Success Message:** "Quality/Risk manager can mark incident as resolved"

**Failure Messages:**

- "Incident not found"
- "Users cannot close their own incidents (system-enforced rule)"
- "Only Quality/Risk managers can mark incidents as resolved, and users cannot close their own incidents"

---

### can_export_data()

**Purpose:** Checks if a user can export incident data/logs

**Returns:** RepositoryResponse with success status and message

**Conditions:**

- **Role-based access:**
     - Super users can export all data
     - Quality/Risk managers can export all facility logs
     - Admins can export facility logs (with facility access)
     - Directors can export data (read-only, with facility access)
     - Managers can export dept logs (limited, with department access)

**Success Messages:**

- "Super user can export all data"
- "Quality/Risk manager can export data"
- "Admin can export facility data"
- "Director can export data (read-only)"
- "Manager can export dept logs (limited)"

**Failure Messages:**

- "Admin needs facility access to export data"
- "Director needs facility access to export data"
- "Manager needs department access to export data"
- "User does not have permission to export data"

---

### can_manage_restricted_access()

**Purpose:** Checks if a user can grant/revoke restricted access permissions

**Returns:** RepositoryResponse with success status and message

**Conditions:**

- **Role-based access:**
     - Super users have full access management rights
     - Admins can grant/revoke restricted access
     - Quality/Risk managers can assign restricted access

**Success Messages:**

- "Super user can manage restricted access"
- "Admin can manage restricted access"
- "Quality/Risk manager can assign restricted access"

**Failure Messages:**

- "Only Admins, Quality/Risk managers, and Super users can manage restricted access"

## Helper Methods

### \_is_owner()

**Purpose:** Check if the user is the owner (creator) of the incident

**Returns:** Boolean

**Logic:** Compares incident.created_by.id with user.id

---

### \_is_in_review_tasks()

**Purpose:** Check if user is assigned to any review task (as reviewer or group member)

**Returns:** Boolean

**Logic:**

- Gets user's profile
- Checks all review tasks for the incident
- Verifies if user is a direct reviewer OR member of any review group

---

### \_has_role_based_access()

**Purpose:** Check if user has role-based access with facility/department validation

**Returns:** Boolean

**Logic:**

- Super user: No facility restriction needed
- Admin: Needs facility access
- Quality/Risk Manager: Needs facility access
- Director: Needs facility access (read-only)
- Manager: Needs department access

---

### \_has_role_based_access_for_modification()

**Purpose:** Check if user has role-based access for modification (excludes Directors)

**Returns:** Boolean

**Logic:**

- Super user: No facility restriction needed
- Admin: Needs facility access
- Quality/Risk Manager: Needs facility access
- Manager: Needs department access
- Directors are excluded from modification access

---

### \_has_facility_access()

**Purpose:** Check if user has access to incident's facility

**Returns:** Boolean

**Logic:** Verifies if incident.report_facility is in user's profile.access_to_facilities

---

### \_has_department_access()

**Purpose:** Check if user has access to incident's department

**Returns:** Boolean

**Logic:** Verifies if incident.department is in user's profile.access_to_department

## Usage Example

```python
from incidents.services.permissions import IncidentPermissionsService

# Initialize service
permissions_service = IncidentPermissionsService(
    user=request.user,
    app_label="general_patient_visitor",
    incident=incident_obj
)

# Check if user can create incidents
result = permissions_service.can_create_incident()
if result.success:
    # User can create incidents
    pass

# Check if user can view specific incident
result = permissions_service.can_view_incident()
if result.success:
    # User can view this incident
    pass

# Check if user can modify incident
result = permissions_service.can_modify_incident()
if result.success:
    # User can modify this incident
    pass

# Check Quality/Risk manager exclusive permissions
result = permissions_service.can_add_severity_rating()
if result.success:
    # Only Quality/Risk managers reach here
    pass
```

## Permission Summary by Role

### Regular Users (Authenticated)

- ✅ Create incidents
- ✅ View own incidents
- ❌ Modify incidents (even their own - per userFlow.md)
- ❌ Add reviews (even to their own - per userFlow.md)
- ✅ List own incidents
- ❌ Delete incidents
- ❌ Send to department
- ❌ Add severity ratings
- ❌ Mark as resolved
- ❌ Export data
- ❌ Manage restricted access

### Review Task Assignees (Special Access)

- ✅ Create incidents
- ✅ View assigned incidents
- ✅ Modify assigned incidents (override regular user restrictions)
- ✅ Add reviews to assigned incidents (override regular user restrictions)
- ✅ List incidents
- ❌ Delete incidents
- ❌ Send to department
- ❌ Add severity ratings
- ❌ Mark as resolved
- ❌ Export data
- ❌ Manage restricted access

### Managers

- ✅ All regular user permissions
- ✅ View incidents in their departments
- ✅ Modify incidents in their departments
- ✅ Add reviews to incidents in their departments
- ✅ Export dept logs (limited)
- ❌ Delete incidents
- ❌ Send to department
- ❌ Add severity ratings (restricted action per userFlow.md)
- ❌ Mark as resolved (cannot close incidents per userFlow.md)
- ❌ Manage restricted access

### Directors

- ✅ Create incidents
- ✅ View incidents in their facilities (read-only access per userFlow.md)
- ❌ Modify incidents (read-only access per userFlow.md)
- ❌ Add reviews (read-only access per userFlow.md)
- ✅ List incidents
- ✅ Export data (read-only)
- ❌ Delete incidents
- ❌ Send to department
- ❌ Add severity ratings
- ❌ Mark as resolved
- ❌ Manage restricted access

### Admins

- ✅ All regular user permissions
- ✅ View incidents in their facilities
- ✅ Modify incidents in their facilities
- ✅ Add reviews to incidents in their facilities
- ✅ Send incidents to departments (per userFlow.md)
- ✅ Export facility logs
- ✅ Manage restricted access (grant/revoke permissions per userFlow.md)
- ❌ Delete incidents
- ❌ Add severity ratings
- ❌ Mark as resolved

### Quality/Risk Managers

- ✅ All regular user permissions
- ✅ View incidents in their facilities
- ✅ Modify incidents in their facilities
- ✅ Add reviews to incidents in their facilities
- ✅ Send incidents to departments
- ✅ Add severity ratings
- ✅ Mark incidents as resolved (except own incidents - no self-closing)
- ✅ Export all facility logs
- ✅ Assign restricted access
- ❌ Delete incidents

### Super Users

- ✅ All permissions including delete
- ✅ No facility/department restrictions
- ✅ Full system access
- ✅ Export all data
- ✅ Manage restricted access

## Security Notes

1. **Facility/Department Access Control:** Admin and Quality/Risk manager roles require appropriate facility or department access
2. **Review Task Assignment:** Users gain access to incidents through explicit review task assignments (overrides regular user restrictions)
3. **Quality/Risk Manager Exclusivity:** Critical operations (severity rating, resolution) are restricted to Quality/Risk managers only
4. **Super User Override:** Only Super users can delete incidents
5. **No Self-Closing Rule:** System-enforced prevention of users closing their own incidents (per userFlow.md)
6. **Director Read-Only Access:** Directors have view and export rights but no modification rights (per userFlow.md)
7. **Manager Restrictions:** Cannot close incidents or add severity ratings (per userFlow.md)
8. **Regular User Restrictions:** Cannot modify or add reviews to incidents, even their own (per userFlow.md)
9. **Admin Privileges:** Can send to department and manage restricted access (per userFlow.md)
10. **Explicit Permissions:** Custom permissions can override role-based restrictions
11. **Active User Requirement:** All operations require active user accounts

## Test Coverage

The service includes comprehensive test coverage with 55 total tests across 11 test classes:

- TestCreateIncident (2 tests)
- TestViewIncident (8 tests)
- TestModifyIncident (8 tests) - includes new Director and regular user restriction tests
- TestDeleteIncident (3 tests)
- TestListIncidents (4 tests)
- TestSendToDepartment (6 tests) - includes new Admin access test
- TestAddReview (7 tests) - includes new Director restriction test
- TestAddSeverityRating (6 tests) - includes new Manager restriction test
- TestMarkAsResolved (5 tests) - includes self-closing prevention test
- TestExportData (4 tests) - new test class for export permissions
- TestManageRestrictedAccess (6 tests) - new test class for restricted access management
