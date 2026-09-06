import type { Tables } from "../../types/database.types";

export type Cabin = Tables<"cabins">;

export const cabinFilterOptions = [
  { value: "all", label: "All" },
  { value: "with-discount", label: "With discount" },
  { value: "no-discount", label: "No discount" },
] as const;

export type CabinSortField = Extract<
  keyof Cabin,
  "name" | "regularPrice" | "maxCapacity"
>;
export type SortDirection = "asc" | "desc";

export type CabinSort = {
  field: CabinSortField;
  direction: SortDirection;
};

export const cabinSortOptions = [
  {
    value: "name-asc",
    label: "Sort by name (A-Z)",
    sort: { field: "name", direction: "asc" },
  },
  {
    value: "name-desc",
    label: "Sort by name (Z-A)",
    sort: { field: "name", direction: "desc" },
  },
  {
    value: "regularPrice-asc",
    label: "Sort by price (low first)",
    sort: { field: "regularPrice", direction: "asc" },
  },
  {
    value: "regularPrice-desc",
    label: "Sort by price (high first)",
    sort: { field: "regularPrice", direction: "desc" },
  },
  {
    value: "maxCapacity-asc",
    label: "Sort by capacity (low first)",
    sort: { field: "maxCapacity", direction: "asc" },
  },
  {
    value: "maxCapacity-desc",
    label: "Sort by capacity (high first)",
    sort: { field: "maxCapacity", direction: "desc" },
  },
] as const;

export type CabinFilterValue = (typeof cabinFilterOptions)[number]["value"];
export type CabinSortValue = (typeof cabinSortOptions)[number]["value"];

export type DuplicableCabin = Cabin & {
  name: NonNullable<Cabin["name"]>;
  image: NonNullable<Cabin["image"]>;
  maxCapacity: NonNullable<Cabin["maxCapacity"]>;
  regularPrice: NonNullable<Cabin["regularPrice"]>;
  discount: NonNullable<Cabin["discount"]>;
  description: NonNullable<Cabin["description"]>;
};

export function isDuplicableCabin(cabin: Cabin): cabin is DuplicableCabin {
  return (
    typeof cabin.name === "string" &&
    typeof cabin.image === "string" &&
    cabin.image.length > 0 &&
    typeof cabin.maxCapacity === "number" &&
    typeof cabin.regularPrice === "number" &&
    typeof cabin.discount === "number" &&
    typeof cabin.description === "string"
  );
}

export function parseCabinFilter(value: string | null): CabinFilterValue {
  if (value === "with-discount" || value === "no-discount") return value;

  return "all";
}

function isCabinSortValue(value: string): value is CabinSortValue {
  return cabinSortOptions.some((option) => option.value === value);
}

export function parseCabinSort(value: string | null): CabinSort {
  if (!value || !isCabinSortValue(value)) {
    return { field: "name", direction: "asc" };
  }

  const sortOption = cabinSortOptions.find((option) => option.value === value);
  if (sortOption) return sortOption.sort;

  return { field: "name", direction: "asc" };
}

function compareNullableValues<T extends string | number>(
  first: T | null,
  second: T | null,
  direction: SortDirection,
) {
  if (first === null) return second === null ? 0 : 1;
  if (second === null) return -1;
  if (first === second) return 0;

  const comparison = first < second ? -1 : 1;
  return direction === "asc" ? comparison : -comparison;
}

function compareCabins(
  first: Cabin,
  second: Cabin,
  { field, direction }: CabinSort,
) {
  if (field === "name") {
    return compareNullableValues(first.name, second.name, direction);
  }

  if (field === "regularPrice") {
    return compareNullableValues(
      first.regularPrice,
      second.regularPrice,
      direction,
    );
  }

  return compareNullableValues(
    first.maxCapacity,
    second.maxCapacity,
    direction,
  );
}

export function sortCabins(cabins: Cabin[], sort: CabinSort) {
  return [...cabins].sort((first, second) => compareCabins(first, second, sort));
}
