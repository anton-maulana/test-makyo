import React from "react";

export interface MDropdownProps extends React.HTMLAttributes<HTMLDivElement> {
    data: Record<string, any>[] | string[],
    id?: string,
    onSelected?: (value: string, row?: Record<string, any>) => void,
    outlined?: boolean,
    search?: boolean,
    titleProperty?: string,
    multiple?: boolean,
    zIndexDropdown?: number
}