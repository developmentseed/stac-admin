import { useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Box, Button, Text } from "@chakra-ui/react";
import { useCollection } from "@developmentseed/stac-react";

import { HeadingLead, Loading } from "../components";
import { TextInput, TextAreaInput } from "../components/forms";
import useUpdateCollection from "./useUpdateCollection";
import { usePageTitle } from "../hooks";

type FormValues = {
  title: string;
  description: string;
  license: string;
}

function CollectionForm() {
  const { collectionId } = useParams();
  usePageTitle(`Edit collection ${collectionId}`);
  const { collection, state, reload } = useCollection(collectionId!);
  const { update, state: updateState } = useUpdateCollection();

  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({ values: collection });
  const onSubmit = (data: any) => {
    update(data).then(reload);
  };

  if (!collection || state === "LOADING") {
    return <Loading>Loading collection...</Loading>
  }

  return (
    <>
      <Text as="h1">
        <HeadingLead>Edit Collection</HeadingLead> {collection.id}
      </Text>
      <form onSubmit={handleSubmit(onSubmit)}>
        <TextInput
          label="Title"
          error={errors.title}
          {...register("title")}
        />
        <TextAreaInput
          label="Description"
          error={errors.description}
          {...register("description", { required: 'Enter a collection description.'})}
        />
        <TextInput
          label="License"
          error={errors.license}
          {...register("license")}
        />

        <Box mt="4">
          <Button type="submit" isLoading={updateState === "LOADING"}>Save collection</Button>
        </Box>
      </form>
    </>
  );
}

export default CollectionForm;
