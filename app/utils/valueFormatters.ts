import { format, formatDistance, formatRelative, subDays } from "date-fns"

import { GridValueFormatterParams } from "@mui/x-data-grid";

export function dateTimeValueFormatter(params: GridValueFormatterParams): string {
    if(params.value) {
        return format(new Date(), 'dd.MM.yyyy HH:mm:ss');
    } else {
        return '';
    }
}
