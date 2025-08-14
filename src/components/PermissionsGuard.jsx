import { useGetPermissions } from "@/hooks/fetchPermissions";
import ModifyPageLoader from "./loader";

const checkUserPermission = (permissions, model, codename) => {
    if (!permissions || !permissions[model]) {
        return false;
    }

    const modelPermissions = permissions[model];
    
    if (Array.isArray(modelPermissions)) {
        // Check if it's an array of strings
        if (typeof modelPermissions[0] === 'string') {
            return modelPermissions.includes(codename);
        }
        // Check if it's an array of objects with codename property
        else if (typeof modelPermissions[0] === 'object' && modelPermissions[0].codename) {
            return modelPermissions.some(permission => permission.codename === codename);
        }
    }
    
    return false;
};

const PermissionsGuard = ({ model, codename, children }) => {
    const { permissions, loading, error } = useGetPermissions();

    // console.log('permissions:', permissions);

    if (loading) {
        return <ModifyPageLoader />;
    }

    if (error) {
        return <p>Error loading permissions: {error}</p>;
    }

    if (!permissions) {
        return <p>You have no access to perform this action.</p>;
    }

    const hasAccess = checkUserPermission(permissions, model, codename);

    // console.log('hasAccess:', hasAccess, 'for model:', model, 'codename:', codename);

    if (!hasAccess) {
        return <p>You have no access to perform this action.</p>;
    }

    return <>{children}</>;
};

export default PermissionsGuard;
