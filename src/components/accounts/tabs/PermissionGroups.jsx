import { SearchInput } from "@/components/forms/Search";
import OutlineButton from "@/components/OutlineButton";
import PrimaryButton from "@/components/PrimaryButton";
import { useGroupContext } from "@/context/providers/Group";
import api, { createUrlParams } from "@/utils/api";
import { Eye, Plus, SquarePen, Trash2, X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useCallback, useEffect, useState } from "react";
import AddPermissionGroupForm from "../forms/AddPermissionGroupForm";
import DeletePermissionGroup from "../forms/DeletePermissionGroupForm";
import EditPermissionGroupForm from "../forms/EditPermissionGroupForm";

const PermissionGroups = () => {
  const router = useRouter();
  const { setSelectedGroup } = useGroupContext();
  const [groups, setGroups] = useState([]);

  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const [showNewUserForm, setShowNewUserForm] = useState(false);
  const [showEditPermissionForm, setShowEditPermissionForm] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [groupToShow, setGroupToShow] = useState(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [isSearching, setIsSearching] = useState(false);
  const isFocused = document.activeElement;
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");
  const [groupId, setGroupId] = useState();
  const [group, setGroup] = useState();

  const handleShowDeleteModal = (id, group) => {
    setShowDeleteModal(!showDeleteModal);
    setGroup(group);

    setGroupId(id);

  };

  const formatGroupDataForDelete = (group) => {
    return {
      group_name: group.name,
      permissions: group.permissions.map((permGroup) => ({
        feature: permGroup.feature,
        permissions: permGroup.perms,
      })),
    };
  };

  const handleShowEditPermissionForm = (id) => {
    setShowEditPermissionForm(!showEditPermissionForm);
    setGroupId(id);
  };
  const handleDeletePermissionGroup = async () => {
    setIsDeleting(true);
    setDeleteError("");

    const formattedBody = formatGroupDataForDelete(group);

    try {
      const response = await api.delete(
        `/permissions/${groupId}/remove-permissions/`,
        {
          data: formattedBody,
        }
      );

      if (response.status === 204 || response.status === 200) {

        try {
          const response = await api.delete(`/permissions/`, {
            data: {
              id: group.id,
            },
          });

          if (response.status === 204 || response.status === 200) {
            setShowDeleteModal(false);
            window.location.reload();
          }
        } catch (error) {

        }
        handleFetchGroups();
      } else {
        throw new Error("Failed to delete group");
      }
    } catch (err) {
      setDeleteError("Failed to delete permission group. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleSearch = useCallback(() => {
    if (searchQuery.length >= 3) {
      setIsSearching(true);
      const params = createUrlParams({
        q: searchQuery,
        page: pageNumber,
        page_size: pageSize,
      });
      handleFetchGroups(params);
    } else if (searchQuery.length === 0 && isFocused) {
      setIsSearching(true);
      handleFetchGroups();
    } else {
      setIsSearching(false);
    }
  }, [searchQuery]);

  const handleClose = () => {
    setShowNewUserForm(false);
  };
  const handleCloseEditPermissionForm = () => {
    setShowEditPermissionForm(false);
  };
  const handleApplyFilters = () => {
    const params = createUrlParams({
      page: pageNumber,
      page_size: pageSize,
    });
    setIsSearching(true);
    handleFetchGroups(params);
    setShowFilters(false);
  };

  const handleShowFilters = () => {
    setShowFilters(!showFilters);
  };

  const handleShowDetails = (group) => {
    setSelectedGroup(group);
    router.push(`/accounts/permission-groups/${group.id}`);
  };

  useEffect(() => {
    const debounceTimeout = setTimeout(() => {
      handleSearch();
    }, 300);

    return () => clearTimeout(debounceTimeout);
  }, [searchQuery, handleSearch]);

  const handleFetchGroups = async (params) => {
    setIsLoading(true);
    try {
      const response = await api.get(`/permissions/`);
      if (response.status === 200) {

        setGroups(response.data);
        return;
      } else {
        setErrorMessage("Error fetching groups. Contact support.");
      }
    } catch (error) {

      setErrorMessage("Error fetching groups. Contact support.");
    } finally {
      setIsLoading(false);
      setIsSearching(false);
    }
  };
  useEffect(() => {
    handleFetchGroups();
  }, []);
  return (
    <div className="permission-groups">
      <div className="filters">
        <SearchInput
          value={searchQuery}
          setValue={setSearchQuery}
          isSearching={isSearching}
          label={"Search permission groups"}
        />

        <div className="actions">
          <span>Page: {pageNumber}</span>
          <span>Per page: {pageSize}</span>
          <div className="filters-popup">
            <OutlineButton
              onClick={handleShowFilters}
              span={"Filters"}
              prefixIcon={showFilters ? <X /> : <Plus />}
            />

            {showFilters ? (
              <div className="side-popup">
                <div className="popup-content">
                  <h3>Filters</h3>
                  <form>
                    <div className="half">
                      <div className="form-group">
                        <label htmlFor="page">Page</label>
                        <input
                          value={pageNumber}
                          onChange={(e) => setPageNumber(e.target.value)}
                          type="number"
                          name="pageNumber"
                          id="pageNumber"
                          placeholder="Page number"
                        />
                      </div>
                      <div className="form-group">
                        <label htmlFor="page">Page size</label>
                        <input
                          value={pageSize}
                          onChange={(e) => setPageSize(e.target.value)}
                          type="number"
                          name="pageSize"
                          id="pageSize"
                          placeholder="Page size"
                        />
                      </div>
                    </div>
                  </form>

                  <PrimaryButton
                    text={"Apply filters"}
                    onClick={handleApplyFilters}
                  />
                </div>
              </div>
            ) : (
              ""
            )}
          </div>

          <PrimaryButton
            onClick={() => setShowNewUserForm(true)}
            span="Add permission group"
            prefixIcon={<Plus />}
            customClass={"sticky-button"}
          />
        </div>
      </div>
      <table>
        <thead>
          <tr>
            <th>Permission group</th>
            <th>Created at</th>
            <th>Total feature</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {groups.map((group) => (
            <tr key={group.id}>
              <td>{group.name || '-'}</td>
              <td>{group.created_at || '-'}</td>
              <td>{group.permissions?.length || 0}</td>
              <td>
                <Trash2 size={18} onClick={() => handleShowDeleteModal(group.id, group)} />
                <SquarePen size={18} onClick={() => handleShowEditPermissionForm(group.id)} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showNewUserForm && <AddPermissionGroupForm handleClose={handleClose} />}
      {showEditPermissionForm && (
        <EditPermissionGroupForm
          handleClose={() => setShowEditPermissionForm(false)}
          groupId={groupId}
        />
      )}
      {showDeleteModal && (
        <DeletePermissionGroup
          onClose={() => setShowDeleteModal(false)}
          onConfirm={handleDeletePermissionGroup}
          isLoading={isDeleting}
          error={deleteError}
        />
      )}
    </div>
  );
};

export default PermissionGroups;
