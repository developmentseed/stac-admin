import { useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Box, Heading, Button, Text } from "@chakra-ui/react";
import { useItem } from "@developmentseed/stac-react";
import { HeadingLead, Loading } from "../components";
import useUpdateItem from "./useUpdateItem";
import { TextInput, TextAreaInput } from "../components/forms";
import { usePageTitle } from "../hooks";

type FormValues = {
  properties: {
    title: string;
    description: string;
    license: string;
  }
}

function ItemForm () {
  const { collectionId, itemId } = useParams();
  usePageTitle(`Edit item ${itemId}`);
  const itemResource = `${process.env.REACT_APP_STAC_API}/collections/${collectionId}/items/${itemId}`
  const { item, state, reload } = useItem(itemResource);
  const { update, state: updateState } = useUpdateItem(itemResource);

  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({ values: item });
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

        <Box mt="4">
          <Button type="submit" isLoading={updateState === "LOADING"}>Save item</Button>
        </Box>
      </form>
    </>
  );
}

export default ItemForm;
