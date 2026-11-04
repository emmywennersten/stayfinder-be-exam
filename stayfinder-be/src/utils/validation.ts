type ValidationIssue = {
    path: readonly PropertyKey[];
    message: string;
  };
  
  export function formatValidationErrors(issues: readonly ValidationIssue[]) {
    return {
      errors: issues.map((issue) => ({
        field: issue.path.map(String).join("."),
        message: issue.message,
      })),
    };
  }