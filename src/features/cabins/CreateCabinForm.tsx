import {
  type SubmitErrorHandler,
  type SubmitHandler,
  useForm,
} from "react-hook-form";
import styled from "styled-components";

import Input from "../../ui/Input";
import BaseForm from "../../ui/Form";
import Button from "../../ui/Button";
import FileInput from "../../ui/FileInput";
import Textarea from "../../ui/Textarea";
import FormRow from "../../ui/FormRow";
import { useCreateCabin } from "./useCreateCabin";
import { useEditCabin } from "./useEditCabin";
import type { createEditCabin } from "../../services/apiCabins";
import type { Tables } from "../../types/database.types";

const Form = styled(BaseForm)<{ type: "modal" | "regular" }>``;
const SecondaryButton = styled(Button)<{ variation: "secondary" }>``;

type Cabin = Tables<"cabins">;
type CabinMutationInput = Parameters<typeof createEditCabin>[0];

type CabinFormValues = {
  name: NonNullable<CabinMutationInput["name"]>;
  maxCapacity: NonNullable<CabinMutationInput["maxCapacity"]>;
  regularPrice: NonNullable<CabinMutationInput["regularPrice"]>;
  discount: NonNullable<CabinMutationInput["discount"]>;
  description: NonNullable<CabinMutationInput["description"]>;
  image: FileList | string;
};

type CreateCabinFormProps = {
  cabinToEdit?: Cabin;
  onCloseModal?: () => void;
};

function getEditDefaultValues(cabin: Cabin): CabinFormValues {
  return {
    name: cabin.name ?? "",
    maxCapacity: cabin.maxCapacity ?? 0,
    regularPrice: cabin.regularPrice ?? 0,
    discount: cabin.discount ?? 0,
    description: cabin.description ?? "",
    image: cabin.image ?? "",
  };
}

function getCabinImage(image: CabinFormValues["image"]): File | string | undefined {
  if (typeof image === "string") return image;

  return image.item(0) ?? undefined;
}

function CreateCabinForm({
  cabinToEdit,
  onCloseModal,
}: CreateCabinFormProps) {
  const isEditMode = cabinToEdit !== undefined;

  const { register, handleSubmit, reset, getValues, formState } =
    useForm<CabinFormValues>({
      defaultValues: cabinToEdit ? getEditDefaultValues(cabinToEdit) : {},
    });
  const { errors } = formState;

  const { isCreating, createCabin } = useCreateCabin();
  const { isEditing, editCabin } = useEditCabin();

  const isWorking = isCreating || isEditing;

  const onSubmit: SubmitHandler<CabinFormValues> = (data) => {
    const image = getCabinImage(data.image);

    if (image === undefined) return;

    const newCabinData: CabinMutationInput = { ...data, image };

    if (cabinToEdit) {
      editCabin(
        { newCabinData, id: cabinToEdit.id },
        {
          onSuccess: () => {
            reset();
            onCloseModal?.();
          },
        },
      );
    } else {
      createCabin(
        newCabinData,
        {
          onSuccess: () => {
            reset();
            onCloseModal?.();
          },
        },
      );
    }
  };

  const onError: SubmitErrorHandler<CabinFormValues> = () => {};

  return (
    <Form
      onSubmit={handleSubmit(onSubmit, onError)}
      type={onCloseModal ? "modal" : "regular"}
    >
      <FormRow label="Cabin name" error={errors?.name?.message}>
        <Input
          type="text"
          id="name"
          disabled={isWorking}
          {...register("name", {
            required: "This field is required",
          })}
        />
      </FormRow>

      <FormRow label="Maximum capacity" error={errors?.maxCapacity?.message}>
        <Input
          type="number"
          id="maxCapacity"
          disabled={isWorking}
          {...register("maxCapacity", {
            valueAsNumber: true,
            required: "This field is required",
            min: {
              value: 1,
              message: "Capacity must be at least 1",
            },
          })}
        />
      </FormRow>

      <FormRow label="Regular price" error={errors?.regularPrice?.message}>
        <Input
          type="number"
          id="regularPrice"
          disabled={isWorking}
          {...register("regularPrice", {
            valueAsNumber: true,
            required: "This field is required",
            min: {
              value: 1,
              message: "Regular price must be at least 1",
            },
          })}
        />
      </FormRow>

      <FormRow label="Discount" error={errors?.discount?.message}>
        <Input
          type="number"
          id="discount"
          defaultValue={0}
          disabled={isWorking}
          {...register("discount", {
            valueAsNumber: true,
            required: "This field is required",
            validate: (value) =>
              value <= getValues("regularPrice") ||
              "Discount must be less than regular price",
          })}
        />
      </FormRow>

      <FormRow
        label="Description for website"
        error={errors?.description?.message}
      >
        <Textarea
          id="description"
          defaultValue=""
          disabled={isWorking}
          {...register("description", {
            required: "This field is required",
          })}
        />
      </FormRow>

      <FormRow label="Cabin photo" error={undefined}>
        <FileInput
          id="image"
          accept="image/*"
          {...register("image", {
            required: isEditMode ? false : "This field is required",
          })}
        />
      </FormRow>

      <FormRow label={undefined} error={undefined}>
        {/* type is an HTML attribute! */}
        <SecondaryButton
          variation="secondary"
          type="reset"
          onClick={() => onCloseModal?.()}
        >
          Cancel
        </SecondaryButton>
        <Button disabled={isWorking}>
          {isEditMode ? "Edit cabin" : "Create new cabin"}
        </Button>
      </FormRow>
    </Form>
  );
}

export default CreateCabinForm;
