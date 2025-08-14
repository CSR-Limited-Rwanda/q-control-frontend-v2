# AccountsPermissionsService Documentation

This service handles permission checking for account/profile operations in the quality control system.

## Overview

The `AccountsPermissionsService` class provides methods to check if a user has permission to perform various operations on user accounts and profiles.

## Constructor

```python
AccountsPermissionsService(user: Type[User])
```

Initialize the service with a Django User object whose permissions will be checked.

## Methods

### can_create_account()

**Purpose:** Checks if a user can create new accounts

**Returns:** APIResponse with success status and message

**Conditions:**

- User must be active
- User must have the 'accounts.add_profile' permission
- OR User must be in group: 'User editors' or 'Super user'

**Success Message:** "User can create an account"

**Failure Messages:**

- "User account is not active"
- "Current user does not have enough permissions to create an account"

---

### can_view_account(account_id)

**Purpose:** Checks if a user can view a specific account

**Parameters:**

- `account_id`: ID of the profile/account to view

**Returns:** APIResponse with success status and message

**Conditions:**

- User must be active
- User can always view their own account
- For other accounts: User must have 'accounts.view_profile' permission
- For other accounts: User must be in group: 'User editors', 'Super user', 'Admin', 'Director', or 'Manager'

**Success Messages:**

- "User can view their own account" (for own account)
- "User can view the account" (for other accounts)

**Failure Messages:**

- "User account is not active"
- "Account does not exist"
- "Current user does not have enough permissions to view the account"

---

### can_list_accounts()

**Purpose:** Checks if a user can list/browse accounts

**Returns:** APIResponse with success status and message

**Conditions:**

- User must be active
- User must have the 'accounts.view_list' permission
- OR User must be in group: 'User editors', 'Super user', 'Admin', 'Director', or 'Manager'

**Success Message:** "User can list accounts"

**Failure Messages:**

- "User account is not active"
- "Current user does not have enough permissions to list accounts"

---

### can_update_account(account_id, request_data)

**Purpose:** Checks if a user can update a specific account

**Parameters:**

- `account_id`: ID of the profile/account to update
- `request_data`: Dictionary containing the fields to be updated

**Returns:** APIResponse with success status and message

**Conditions:**

- User must be active
- User can update their own account (basic fields only)
- OR User must have 'accounts.change_profile' permission
- OR User must be in group: 'User editors', 'Admin', or 'Super user'

**Special Rules:**

- **Restricted Fields:** Only 'Super user' can modify: permissions, user, totp, mfa_enabled, is_test_account, is_deleted, deleted_at, created_at, updated_at, created_by, updated_by
- If restricted fields are in request_data, user must be in 'Super user' group

**Success Messages:**

- "User can update their own account" (for own account)
- "User can update the account" (for other accounts)

**Failure Messages:**

- "User account is not active"
- "Only Super users can modify restricted fields (permissions, user, system fields)"
- "Current user does not have enough permissions to update this account"

---

### can_delete_account(account_id)

**Purpose:** Checks if a user can delete a specific account

**Parameters:**

- `account_id`: ID of the profile/account to delete

**Returns:** APIResponse with success status and message

**Conditions:**

- User must be active
- User must have 'accounts.delete_profile' permission
- OR User must be in group: 'User editors', 'Admin', or 'Super user'

**Security Rule:** Users cannot delete their own accounts

**Success Message:** "User can delete the account"

**Failure Messages:**

- "User account is not active"
- "Users cannot delete their own accounts"
- "Current user does not have enough permissions to delete this account"

## Helper Methods

### \_user_has_per(perms)

**Purpose:** Check if user has any of the specified permissions

**Parameters:**

- `perms`: List of permission strings in format 'app_label.permission_codename'

**Returns:** Boolean

---

### \_user_in_group(group_names)

**Purpose:** Check if user is in any of the specified groups

**Parameters:**

- `group_names`: List of group name strings

**Returns:** Boolean

---

### \_user_owns_account(account_id)

**Purpose:** Check if the user owns the specified account

**Parameters:**

- `account_id`: ID of the profile/account to check

**Returns:** Boolean

## Usage Example

```python
from accounts.services.permisions import AccountsPermissionsService

# Initialize service with current user
permissions_service = AccountsPermissionsService(request.user)

# Check if user can create accounts
result = permissions_service.can_create_account()
if result.success:
    # User can create accounts
    pass

# Check if user can view specific account
result = permissions_service.can_view_account(profile_id)
if result.success:
    # User can view this account
    pass

# Check if user can update account with specific data
request_data = {'first_name': 'John', 'last_name': 'Doe'}
result = permissions_service.can_update_account(profile_id, request_data)
if result.success:
    # User can update this account
    pass
```

## Security Notes

1. **Active User Requirement:** All operations require the user to be active
2. **Self-Deletion Prevention:** Users cannot delete their own accounts for security
3. **Restricted Fields:** System-critical fields can only be modified by Super users
4. **Group-Based Fallbacks:** Permission checks fall back to group membership for flexibility
5. **Own Account Access:** Users have special access to view and update their own accounts
6. **Admin Role Integration:** Admins can manage user accounts per userFlow.md requirements
7. **User Editor Scope:** User Editors are specialized for account management operations

## UserFlow.md Compliance

This service adheres to the role definitions specified in userFlow.md:

- **User Editors:** Can create/edit/deactivate user accounts, submit own reports (no access to reports/logs/dashboards)
- **Admins:** Full access to facility incidents, modify reports, send to dept, export logs, **manage user accounts**
- **Super Users:** Full access across all facilities, delete/modify reports/users, configure settings/backups

## Test Coverage

The service includes comprehensive test coverage with 26 total tests across 5 test classes:

- TestCreateProfile (4 tests)
- TestViewProfile (4 tests)
- TestListProfiles (4 tests)
- TestUpdateProfile (8 tests) - includes new Admin role test
- TestDeleteProfile (6 tests) - includes new Admin role test
