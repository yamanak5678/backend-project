export type EmployeeProfile = {
  EmployeeId: number | string;
  Name?: string;
  Email?: string;
  Phone?: string;
  Department?: string;
  Position?: string;
  JoiningDate?: string;
};

export type EmployeeStatus = {
  StatusId: number | string;
  EmployeeId: number | string;
  Status: string;
  Description?: string;
  CreatedAt?: string;
  UpdatedAt?: string;
};

export type WorkDetails = {
  workName: string;
  project: string;
  progress: number;
  update: string;
};

export const WORK_STATUSES = ["Not Started", "In Progress", "On Hold", "Completed"] as const;

export const parseWorkDetails = (description = ""): WorkDetails => {
  const details: WorkDetails = { workName: "", project: "", progress: 0, update: "" };
  const additionalLines: string[] = [];
  for (const line of description.split("\n")) {
    const value = line.trim();
    if (value.startsWith("Work:")) details.workName = value.slice(5).trim();
    else if (value.startsWith("Project:")) details.project = value.slice(8).trim();
    else if (value.startsWith("Progress:")) {
      const progress = Number(value.slice(9).replace("%", "").trim());
      if (Number.isFinite(progress)) details.progress = Math.max(0, Math.min(100, progress));
    } else if (value.startsWith("Update:")) details.update = value.slice(7).trim();
    else if (value && !value.startsWith("Updated At:")) additionalLines.push(value);
  }
  if (!details.update) details.update = additionalLines.join(" ");
  return details;
};

export const formatDate = (value?: string) => {
  if (!value || Number.isNaN(new Date(value).getTime())) return "N/A";
  return new Date(value).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
};

export const formatTime = (value?: string) => {
  if (!value || Number.isNaN(new Date(value).getTime())) return "N/A";
  return new Date(value).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
};
