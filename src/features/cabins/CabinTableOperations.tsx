import TableOperations from "../../ui/TableOperations";
import Filter from "../../ui/Filter";
import SortBy from "../../ui/SortBy";
import {
  cabinFilterOptions,
  cabinSortOptions,
} from "./cabinTableOptions";

function CabinTableOperations() {
  return (
    <TableOperations>
      <Filter
        filterField={"discount"}
        options={cabinFilterOptions}
      />

      <SortBy
        options={cabinSortOptions}
      />
    </TableOperations>
  );
}

export default CabinTableOperations;
