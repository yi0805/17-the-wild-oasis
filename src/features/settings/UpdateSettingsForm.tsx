import type { FocusEvent } from "react";

import Form from "../../ui/Form";
import FormRow from "../../ui/FormRow";
import Input from "../../ui/Input";
import Spinner from "../../ui/Spinner";
import QueryError from "../../ui/QueryError";
import { getSettings, updateSetting } from "../../services/apiSettings";
import { useSettings } from "./useSettings";
import { useUpdateSetting } from "./useUpdateSetting";

type Settings = Awaited<ReturnType<typeof getSettings>>;
type SettingsUpdate = Parameters<typeof updateSetting>[0];
type EditableSettingField =
  | "minBookingLength"
  | "maxBookingLength"
  | "maxGuestsPerBooking"
  | "breakfastPrice";
type NumericSettingUpdate = Pick<
  SettingsUpdate,
  EditableSettingField
>;
type SettingsInputValues = Record<
  EditableSettingField,
  Exclude<Settings[EditableSettingField], null> | ""
>;

function UpdateSettingsForm() {
  const { isLoading, error, settings } = useSettings();
  const { isUpdating, updateSetting } = useUpdateSetting();

  if (isLoading) {
    return <Spinner role="status" aria-label="Loading settings" />;
  }

  if (error) {
    return <QueryError resourceName="Settings" />;
  }

  function handleUpdate(
    event: FocusEvent<HTMLInputElement>,
    field: EditableSettingField,
  ) {
    const { value, valueAsNumber } = event.currentTarget;

    if (value === "" || !Number.isFinite(valueAsNumber)) return;

    const newSetting: NumericSettingUpdate = { [field]: valueAsNumber };
    updateSetting(newSetting);
  }

  const values: SettingsInputValues = {
    minBookingLength: settings?.minBookingLength ?? "",
    maxBookingLength: settings?.maxBookingLength ?? "",
    maxGuestsPerBooking: settings?.maxGuestsPerBooking ?? "",
    breakfastPrice: settings?.breakfastPrice ?? "",
  };

  return (
    <Form>
      <FormRow label="Minimum nights/booking" error={undefined}>
        <Input
          type="number"
          id="min-nights"
          defaultValue={values.minBookingLength}
          disabled={isUpdating}
          onBlur={(event) => handleUpdate(event, "minBookingLength")}
        />
      </FormRow>

      <FormRow label="Maximum nights/booking" error={undefined}>
        <Input
          type="number"
          id="max-nights"
          defaultValue={values.maxBookingLength}
          disabled={isUpdating}
          onBlur={(event) => handleUpdate(event, "maxBookingLength")}
        />
      </FormRow>

      <FormRow label="Maximum guests/booking" error={undefined}>
        <Input
          type="number"
          id="max-guests"
          defaultValue={values.maxGuestsPerBooking}
          disabled={isUpdating}
          onBlur={(event) => handleUpdate(event, "maxGuestsPerBooking")}
        />
      </FormRow>

      <FormRow label="Breakfast price" error={undefined}>
        <Input
          type="number"
          id="breakfast-price"
          defaultValue={values.breakfastPrice}
          disabled={isUpdating}
          onBlur={(event) => handleUpdate(event, "breakfastPrice")}
        />
      </FormRow>
    </Form>
  );
}

export default UpdateSettingsForm;
