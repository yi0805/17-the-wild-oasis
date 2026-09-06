import type { Tables } from "../../types/database.types";

export type Cabin = Tables<"cabins">;

export const cabinFilterOptions = [
  { value: "all", label: "All" },
  { value: "with-discount", label: "With discount" },
  { value: "no-discount", label: "No discount" },
] as const;

export const cabinSortOptions = [
  { value: "name-asc", label: "Sort by name (A-Z)" },
  { value: "name-desc", label: "Sort by name (Z-A)" },
  { value: "regularPrice-asc", label: "Sort by price (low first)" },
  { value: "regularPrice-desc", label: "Sort by price (high first)" },
  { value: "maxCapacity-asc", label: "Sort by capacity (low first)" },
  { value: "maxCapacity-desc", label: "Sort by capacity (high first)" },
] as const;

export type CabinFilterValue = (typeof cabinFilterOptions)[number]["value"];
export type CabinSortField = Extract<
  keyof Cabin,
  "name" | "regularPrice" | "maxCapacity"
>;
export type SortDirection = "asc" | "desc";

export type CabinSort = {
  field: CabinSortField;
  direction: SortDirection;
};

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

export function parseCabinSort(value: string | null): CabinSort {
  const [field, direction] = value?.split("-") ?? [];

  if (
    (field === "name" ||
      field === "regularPrice" ||
      field === "maxCapacity") &&
    (direction === "asc" || direction === "desc")
  ) {
    return { field, direction };
  }

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
