import React from "react";

export interface MDropdownProps extends React.HTMLAttributes<HTMLDivElement> {
    data: Record<string, any>[] | string[],
    titleProperty?: string
}