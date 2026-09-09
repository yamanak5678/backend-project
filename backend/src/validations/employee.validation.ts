export const validateEmployee = (data: any) => {

    const errors: string[] = [];

    // UserId check
    if (!data.userId) {
        errors.push("UserId is required");
    }

    // Phone check
    if (!data.phone) {
        errors.push("Phone is required");
    } else if (!/^\d{10}$/.test(data.phone)) {
        errors.push("Phone must be 10 digits");
    }

    // Department check
    if (!data.department) {
        errors.push("Department is required");
    }

    // Position check
    if (!data.position) {
        errors.push("Position is required");
    }

    // JoiningDate check
    if (!data.joiningDate) {
        errors.push("JoiningDate is required");
    }

    return errors;
};

// PUT validation
export const validateUpdateEmployee = (data: any) => {

    const errors: string[] = [];

    if (!data.phone) {
        errors.push("Phone is required");
    } else if (!/^\d{10}$/.test(data.phone)) {
        errors.push("Phone must be 10 digits");
    }

    if (!data.department) {
        errors.push("Department is required");
    }

    if (!data.position) {
        errors.push("Position is required");
    }

    if (!data.joiningDate) {
        errors.push("JoiningDate is required");
    }

    return errors;
};