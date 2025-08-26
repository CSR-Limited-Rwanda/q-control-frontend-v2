# Test Users Documentation

**Generated on: August 12, 2025**
**Management Command:** `python manage.py create_test_users`

---

## Overview

This document contains comprehensive test user accounts for all roles defined in `userFlow.md`. All users have the same password: **`password@1234`**

---

## User Accounts by Role

### 1. **User** (Basic Staff Users)

_Permissions: Draft/submit incident reports, Upload documents, View drafts and own reports_

| Username          | Email           | Full Name    | Role | Facility Assignment |
| ----------------- | --------------- | ------------ | ---- | ------------------- |
| `user1@email.com` | user1@email.com | John Doe     | User | Random Assignment   |
| `user2@email.com` | user2@email.com | Jane Smith   | User | Random Assignment   |
| `user3@email.com` | user3@email.com | Mike Johnson | User | Random Assignment   |

**Key Capabilities:**

- ✅ Login and access profile
- ✅ Submit incident reports (draft status)
- ✅ Submit complaints
- ✅ View their own reports
- ✅ Upload documents
- ❌ Cannot access other users' reports
- ❌ Cannot modify or delete submitted reports

---

### 2. **Manager** (Department Managers)

_Permissions: Access unrestricted incidents in assigned dept, Add reviews, send to Quality/Risk_

| Username                     | Email                      | Full Name     | Role    | Department Focus    |
| ---------------------------- | -------------------------- | ------------- | ------- | ------------------- |
| `manager1@email.com`         | manager1@email.com         | Sarah Wilson  | Manager | General Management  |
| `manager2@email.com`         | manager2@email.com         | David Brown   | Manager | General Management  |
| `pharmacy_manager@email.com` | pharmacy_manager@email.com | Lisa Garcia   | Manager | Pharmacy Department |
| `hr_manager@email.com`       | hr_manager@email.com       | Robert Taylor | Manager | Human Resources     |

**Key Capabilities:**

- ✅ All User capabilities
- ✅ Access unrestricted incidents in assigned department
- ✅ Add reviews and comments
- ✅ Send reports to Quality/Risk
- ✅ List logs (limited scope)
- ✅ Export department data
- ❌ Cannot close incidents
- ❌ No restricted info without approval

---

### 3. **Director** (Facility Directors)

_Permissions: Read-only access to facility/dept incidents, View dashboards/logs, export data_

| Username              | Email               | Full Name       | Role     | Access Level  |
| --------------------- | ------------------- | --------------- | -------- | ------------- |
| `director1@email.com` | director1@email.com | Michael Davis   | Director | Facility-wide |
| `director2@email.com` | director2@email.com | Jennifer Miller | Director | Facility-wide |

**Key Capabilities:**

- ✅ All User capabilities
- ✅ Read-only access to all facility incidents
- ✅ View dashboards and logs
- ✅ Export facility data
- ❌ No editing/modification rights
- ❌ Restricted info requires approval

---

### 4. **Admin** (System Administrators)

_Permissions: Full access to facility incidents, Modify reports, Export logs, Manage user accounts_

| Username           | Email            | Full Name            | Role  | Access Level   |
| ------------------ | ---------------- | -------------------- | ----- | -------------- |
| `admin1@email.com` | admin1@email.com | Christopher Anderson | Admin | Facility-bound |
| `admin2@email.com` | admin2@email.com | Amanda Thomas        | Admin | Facility-bound |
| `admin3@email.com` | admin3@email.com | Kevin Jackson        | Admin | Facility-bound |

**Key Capabilities:**

- ✅ All User + Manager + Director capabilities
- ✅ Full access to facility incidents
- ✅ Modify and edit reports
- ✅ Send reports to departments
- ✅ Export logs and data
- ✅ Manage user accounts (create/edit/deactivate)
- ✅ Grant restricted access permissions
- ❌ Cannot close own incidents
- ❌ Facility-bound (not cross-facility)

---

### 5. **Quality/Risk Manager** (Quality Assurance & Risk Management)

_Permissions: Full access to all facilities' incidents, Modify, add severity, close (except own)_

| Username                     | Email                      | Full Name     | Role                 | Access Level   |
| ---------------------------- | -------------------------- | ------------- | -------------------- | -------------- |
| `quality_manager1@email.com` | quality_manager1@email.com | Jessica White | Quality/Risk Manager | Cross-facility |
| `risk_manager1@email.com`    | risk_manager1@email.com    | Daniel Harris | Quality/Risk Manager | Cross-facility |

**Key Capabilities:**

- ✅ All previous role capabilities
- ✅ Full access to ALL facilities' incidents
- ✅ Modify and edit any reports
- ✅ Add severity ratings
- ✅ Close incidents (except own)
- ✅ Assign restricted access permissions
- ✅ Cross-facility operations
- ❌ Cannot close own incidents

---

### 6. **Super User** (System Administrators)

_Permissions: Full access across all facilities, Delete/modify reports/users, Configure settings_

| Username               | Email                | Full Name        | Role       | Access Level |
| ---------------------- | -------------------- | ---------------- | ---------- | ------------ |
| `superuser1@email.com` | superuser1@email.com | Elizabeth Martin | Super User | Global       |
| `superuser2@email.com` | superuser2@email.com | William Thompson | Super User | Global       |

**Key Capabilities:**

- ✅ **FULL SYSTEM ACCESS**
- ✅ All previous role capabilities
- ✅ Delete reports and users
- ✅ Configure system settings
- ✅ Backup and restore operations
- ✅ Cross-facility unrestricted access
- ✅ Override all restrictions
- ✅ Close own incidents (exception to the rule)

---

### 7. **User Editor** (Account Management Specialists)

_Permissions: Create/edit/deactivate user accounts, Submit own reports_

| Username                 | Email                  | Full Name     | Role        | Focus Area         |
| ------------------------ | ---------------------- | ------------- | ----------- | ------------------ |
| `user_editor1@email.com` | user_editor1@email.com | Ashley Garcia | User Editor | Account Management |
| `user_editor2@email.com` | user_editor2@email.com | Ryan Martinez | User Editor | Account Management |

**Key Capabilities:**

- ✅ Create new user accounts
- ✅ Edit existing user accounts
- ✅ Deactivate/reactivate users
- ✅ Submit own incident reports
- ❌ No access to reports/logs/dashboards
- ❌ Cannot view other users' incidents

---

## Infrastructure Test Data

### Test Facilities

1. **Central Hospital** (Hospital) - 123 Main St, City Center
2. **North Clinic** (Clinic) - 456 North Ave, Northside
3. **South Medical Center** (Medical Center) - 789 South Blvd, Southside

### Test Departments (per facility)

- Emergency Department
- Pharmacy
- Human Resources
- Nursing
- Administration
- Quality Assurance
- IT Department

### Test Titles

- Chief Executive Officer
- Department Manager
- Registered Nurse
- Staff Member
- Quality Manager
- Risk Manager

---

## Management Commands

### Create Test Users

```bash
# Create all test users
python manage.py create_test_users

# Delete existing test users and create new ones
python manage.py create_test_users --delete-existing

# List existing test users
python manage.py create_test_users --list-users
```

### Create User Groups

```bash
# Create user groups from userFlow.md
python manage.py create_user_groups

# Show group permissions
python manage.py create_user_groups --show-permissions

# Check for duplicate groups
python manage.py create_user_groups --check-duplicates
```

---

## Testing Scenarios

### Login Testing

- Use any username/email combination with password `password@1234`
- Test JWT token generation and validation
- Verify role-based dashboard access

### Permission Testing

- Test incident creation across different user types
- Verify access restrictions (users can only see own data)
- Test modification restrictions (directors cannot edit)
- Validate cross-facility access (Quality/Risk vs Admin)

### Integration Testing

- Run: `python manage.py test base.tests.instegration.test_normal_user`
- Tests complete user flow from login to report submission
- Validates userFlow.md compliance

---

## Security Notes

⚠️ **Important Security Considerations:**

1. **Test Account Isolation**: All accounts are marked as `is_test_account=True`
2. **Password Policy**: Use strong passwords in production
3. **Access Control**: Verify permissions match userFlow.md specifications
4. **Data Segregation**: Test users are assigned to specific facilities/departments
5. **Regular Cleanup**: Remove test accounts in production environments

---

## Troubleshooting

### Common Issues

1. **Permission Errors**: Ensure user groups are created first
2. **Missing Data**: Run infrastructure creation before users
3. **Login Failures**: Verify user is active and password is correct
4. **Access Denied**: Check user group membership and facility assignments

### Debug Commands

```bash
# Check user groups
python manage.py shell -c "from django.contrib.auth.models import User, Group; print([(u.username, [g.name for g in u.groups.all()]) for u in User.objects.filter(email__contains='@email.com')])"

# Check user profiles
python manage.py shell -c "from accounts.models import Profile; [print(f'{p.user.username}: {p.facility}, {p.department}') for p in Profile.objects.filter(is_test_account=True)]"
```

---

**Last Updated:** August 12, 2025  
**Version:** 1.0  
**Related Files:** `userFlow.md`, `create_test_users.py`, `create_user_groups.py`
