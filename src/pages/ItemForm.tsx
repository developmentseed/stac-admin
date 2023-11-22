import { useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Box, FormControl, FormLabel, Textarea, Input, Heading, Button, Text } from "@chakra-ui/react";
import { useItem } from "@developmentseed/stac-react";
import { HeadingLead, Loading } from "../components";
import useUpdateItem from "./useUpdateItem";

type FormValues = {
  something: string;
  properties: {
    title: string;
    description: string;
    license: string;
  }
}

function ItemForm () {
  const { collectionId, itemId } = useParams();
  const itemResource = `http://localhost:8081/collections/${collectionId}/items/${itemId}`
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
        <FormControl>
          <FormLabel>Title</FormLabel>
          <Input {...register("properties.title")} />
        </FormControl>
        <FormControl isInvalid={!!errors.properties?.description}>
          <FormLabel>Description</FormLabel>
          <Textarea {...register("properties.description")} />
        </FormControl>
        <FormControl>
          <FormLabel>License</FormLabel>
          <Input {...register("properties.license")} />
        </FormControl>

        <Box mt="4">
          <Button type="submit" isLoading={updateState === "LOADING"}>Save item</Button>
        </Box>
      </form>
    </>
  );
}

export default ItemForm;
