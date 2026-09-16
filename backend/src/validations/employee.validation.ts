export const validateEmployee = (data: any) => {
    const errors: string[] = [];

    // Name check
    if (
        typeof data.name !== "string" ||
        !data.name.trim()
    ) {
        errors.push("Name is required");
    } else if (data.name.trim().length < 2) {
        errors.push("Name must be at least 2 characters long");
    }

    // Email check
    if (
        typeof data.email !== "string" ||
        !data.email.trim()
    ) {
        errors.push("Email is required");
    } else if (
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
            data.email.trim()
        )
    ) {
        errors.push("Invalid email format");
    }

    // Password check
    if (
        typeof data.password !== "string" ||
        !data.password
    ) {
        errors.push("Password is required");
    } else if (data.password.length < 6) {
        errors.push(
            "Password must be at least 6 characters long"
        );
    }

    // Phone check
    if (
        typeof data.phone !== "string" ||
        !data.phone.trim()
    ) {
        errors.push("Phone is required");
    } else if (
        !/^\d{10}$/.test(data.phone.trim())
    ) {
        errors.push(
            "Phone must be exactly 10 digits"
        );
    }

    // Department check
    if (
        typeof data.department !== "string" ||
        !data.department.trim()
    ) {
        errors.push("Department is required");
    }

    // JoiningDate check
    if (
        typeof data.joiningDate !== "string" ||
        !data.joiningDate.trim()
    ) {
        errors.push("JoiningDate is required");
    } else if (
        !isValidDate(data.joiningDate.trim())
    ) {
        errors.push(
            "JoiningDate must be a valid date in YYYY-MM-DD format"
        );
    }

    // Status check
    if (
        typeof data.status !== "string" ||
        !data.status.trim()
    ) {
        errors.push("Status is required");
    } else if (
        !["Active", "Inactive"].includes(
            data.status.trim()
        )
    ) {
        errors.push(
            "Status must be Active or Inactive"
        );
    }

    return errors;
};


export const validateUpdateEmployee = (data: any) => {
    const errors: string[] = [];

    // Name check
    if (
        typeof data.name !== "string" ||
        !data.name.trim()
    ) {
        errors.push("Name is required");
    } else if (data.name.trim().length < 2) {
        errors.push("Name must be at least 2 characters long");
    }

    // Email check
    if (
        typeof data.email !== "string" ||
        !data.email.trim()
    ) {
        errors.push("Email is required");
    } else if (
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
            data.email.trim()
        )
    ) {
        errors.push("Invalid email format");
    }

    // Phone check
    if (
        typeof data.phone !== "string" ||
        !data.phone.trim()
    ) {
        errors.push("Phone is required");
    } else if (
        !/^\d{10}$/.test(data.phone.trim())
    ) {
        errors.push(
            "Phone must be exactly 10 digits"
        );
    }

    // Department check
    if (
        typeof data.department !== "string" ||
        !data.department.trim()
    ) {
        errors.push("Department is required");
    }
    
    // JoiningDate check
    if (
        typeof data.joiningDate !== "string" ||
        !data.joiningDate.trim()
    ) {
        errors.push("JoiningDate is required");
    } else if (
        !isValidDate(data.joiningDate.trim())
    ) {
        errors.push(
            "JoiningDate must be a valid date in YYYY-MM-DD format"
        );
    }

    return errors;
};


// Validates YYYY-MM-DD and real calendar dates
const isValidDate = (
    dateString: string
): boolean => {
    const parts = dateString.split("-");

    if (parts.length !== 3) {
        return false;
    }

    const year = Number(parts[0]);
    const month = Number(parts[1]);
    const day = Number(parts[2]);

    if (
        !Number.isInteger(year) ||
        !Number.isInteger(month) ||
        !Number.isInteger(day)
    ) {
        return false;
    }

    if (
        month < 1 ||
        month > 12 ||
        day < 1 ||
        day > 31
    ) {
        return false;
    }

    const date = new Date(
        year,
        month - 1,
        day
    );

    return (
        date.getFullYear() === year &&
        date.getMonth() === month - 1 &&
        date.getDate() === day
    );
};