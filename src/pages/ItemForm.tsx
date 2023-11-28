import { useParams } from "react-router-dom";
import { Controller, useForm } from "react-hook-form";
import { Box, Heading, Button, Text } from "@chakra-ui/react";
import { useItem } from "@developmentseed/stac-react";
import { HeadingLead, Loading } from "../components";
import useUpdateItem from "./useUpdateItem";
import { TextInput, TextAreaInput, NumberInput, ArrayInput } from "../components/forms";
import { usePageTitle } from "../hooks";

type FormValues = {
  properties: {
    title: string;
    description: string;
    license: string;
    platform: string;
    constellation: string;
    mission: string;
    gsd: number;
    instrument: string[];
  }
}

function ItemForm () {
  const { collectionId, itemId } = useParams();
  usePageTitle(`Edit item ${itemId}`);
  const itemResource = `${process.env.REACT_APP_STAC_API}/collections/${collectionId}/items/${itemId}`
  const { item, state, reload } = useItem(itemResource);
  const { update, state: updateState } = useUpdateItem(itemResource);

  const { control, register, handleSubmit, formState: { errors } } = useForm<FormValues>({ values: item });
  const onSubmit = (data: any) => {
    update(data).then(reload);
  };

  if (!item || state === "LOADING") {
    return <Loading>Loading item...</Loading>
  }

  return (
    <>
      <Heading as="h1">
        <HeadingLead>Edit Item</HeadingLead> {item.id}
      </Heading>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Text as="h2">Common Meta Data</Text>
        <TextInput
          label="Title"
          error={errors.properties?.title}
          {...register("properties.title")}
        />
        <TextAreaInput
          label="Description"
          error={errors.properties?.description}
          {...register("properties.description")}
        />
        <TextInput
          label="License"
          error={errors.properties?.license}
          {...register("properties.license")}
        />

        <Text as="h2">Instruments</Text>
        <TextInput
          label="Platform"
          error={errors.properties?.platform}
          {...register("properties.platform")}
        />
        <Controller
          name="properties.instrument"
          render={({ field }) => (
            <ArrayInput
              label="Instrument"
              error={errors.properties?.instrument}
              helper="Enter a comma-separated list of sensors used in the creation of the data."
              {...field}
            />
          )}
          control={control}
        />
        <TextInput
          label="Constellation"
          error={errors.properties?.constellation}
          {...register("properties.constellation")}
        />
        <TextInput
          label="Mission"
          error={errors.properties?.mission}
          {...register("properties.mission")}
        />
        <NumberInput
          label="Ground Sample Distance"
          error={errors.properties?.gsd}
          {...register("properties.gsd", { min: 0 })}
        />

        <Box mt="4">
          <Button type="submit" isLoading={updateState === "LOADING"}>Save item</Button>
        </Box>
      </form>
    </>
  );
}

export default ItemForm;
