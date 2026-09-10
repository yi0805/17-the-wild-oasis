import { useSearchParams } from "react-router-dom";
import type { ChangeEvent } from "react";

import Select from "./Select";
import type { SelectOption } from "./Select";

type SortByProps = {
  options: readonly SelectOption[];
};

function SortBy({ options }: SortByProps) {
  const [searchParams, setSearchParams] = useSearchParams();
  const sortBy = searchParams.get("sortBy") || "";

  function handleChange(event: ChangeEvent<HTMLSelectElement>) {
    searchParams.set("sortBy", event.target.value);
    setSearchParams(searchParams);
  }

  return (
    <Select
      options={options}
      type="white"
      value={sortBy}
      onChange={handleChange}
    />
  );
}

export default SortBy;
