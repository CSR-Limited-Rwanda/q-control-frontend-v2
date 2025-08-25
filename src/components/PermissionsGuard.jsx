'use client'
import { useEffect,useRef } from "react";
import { useGetPermissions } from "@/hooks/fetchPermissions";
import ModifyPageLoader from "./loader";
import AccessDeniedPage from "./AccessDenied";

const checkUserPermission = (permissions, model, codename) => {
  if (!permissions || !permissions[model]) {
    return false;
  }

  const modelPermissions = permissions[model];

  if (Array.isArray(modelPermissions)) {
    // Check if it's an array of strings
    if (typeof modelPermissions[0] === "string") {
      return modelPermissions.includes(codename);
    }
    // Check if it's an array of objects with codename property
    else if (
      typeof modelPermissions[0] === "object" &&
      modelPermissions[0].codename
    ) {
      return modelPermissions.some(
        (permission) => permission.codename === codename
      );
    }
  }

  return false;
};

const PermissionsGuard = ({
  model,
  codename,
  children,
  isPage = true,
  onRenderAllowed
}) => {
  const { permissions, loading, error } = useGetPermissions();
  const hasCalledback = useRef(false)
  const hasAccess = checkUserPermission(permissions, model, codename);
  
  useEffect(() => {
    if (hasAccess && onRenderAllowed && !hasCalledback.current) {
      hasCalledback.current = true
      onRenderAllowed()
    }
  }, [hasAccess, onRenderAllowed])

  if (loading) {
    return <ModifyPageLoader />;
  }

  if (error) {
    return <p>Error loading permissions: {error}</p>;
  }

  if (!permissions) {
    return (
      <AccessDeniedPage />
    )
  }

  // console.log('hasAccess:', hasAccess, 'for model:', model, 'codename:', codename);

  if (!hasAccess && isPage) {
    return (
      <AccessDeniedPage />
    )
  }

  if (hasAccess && isPage) {
    return <>{children}</>;
  }

  if (!hasAccess && !isPage) {
    return "";
  }


  return <>{children}</>;
};

export default PermissionsGuard;
