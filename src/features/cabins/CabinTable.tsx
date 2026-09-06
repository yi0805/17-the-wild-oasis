import { useSearchParams } from "react-router-dom";

import Spinner from "../../ui/Spinner";
import CabinRow from "./CabinRow";
import { useCabins } from "./useCabins";
import Table from "../../ui/Table";
import Menus from "../../ui/Menus";
import Empty from "../../ui/Empty";
import {
  parseCabinFilter,
  parseCabinSort,
  sortCabins,
  type Cabin,
} from "./cabinTableOptions";

function CabinTable() {
  const { isLoading, cabins } = useCabins();
  const [searchParams] = useSearchParams();

  if (!cabins?.length) {
    return <Empty resourceName="cabins" />;
  }

  if (isLoading) return <Spinner />;

  const filterValue = parseCabinFilter(searchParams.get("discount"));

  let filteredCabins: Cabin[];
  if (filterValue === "all") {
    filteredCabins = cabins;
  } else if (filterValue === "with-discount") {
    filteredCabins = cabins.filter(
      (cabin) => cabin.discount !== null && cabin.discount > 0,
    );
  } else {
    filteredCabins = cabins.filter((cabin) => cabin.discount === 0);
  }

  const sortBy = parseCabinSort(searchParams.get("sortBy"));
  const sortedCabins = sortCabins(filteredCabins, sortBy);

  return (
    <Menus>
      <Table columns="0.6fr 1.8fr 2.2fr 1fr 1fr 1fr">
        <Table.Header>
          <div></div>
          <div>Cabin</div>
          <div>Capacity</div>
          <div>Price</div>
          <div>Discount</div>
          <div></div>
        </Table.Header>

        <Table.Body
          data={sortedCabins}
          render={(cabin: Cabin) => <CabinRow key={cabin.id} cabin={cabin} />}
        />
      </Table>
    </Menus>
  );
}

export default CabinTable;
