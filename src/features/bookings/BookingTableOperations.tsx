import SortBy from "../../ui/SortBy";
import Filter from "../../ui/Filter";
import TableOperations from "../../ui/TableOperations";
import {
  bookingFilterOptions,
  bookingSortOptions,
} from "./bookingTableOptions";

function BookingTableOperations() {
  return (
    <TableOperations>
      <Filter
        filterField="status"
        options={bookingFilterOptions}
      />

      <SortBy options={bookingSortOptions} />
    </TableOperations>
  );
}

export default BookingTableOperations;
