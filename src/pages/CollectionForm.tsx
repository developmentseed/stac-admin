import { useParams } from "react-router-dom";
import { Controller, useForm } from "react-hook-form";
import { Box, Button, Text } from "@chakra-ui/react";
import { useCollection } from "@developmentseed/stac-react";

import { HeadingLead, Loading } from "../components";
import { TextInput, TextAreaInput, ArrayInput } from "../components/forms";
import useUpdateCollection from "./useUpdateCollection";
import { usePageTitle } from "../hooks";

type FormValues = {
  title: string;
  description: string;
  license: string;
  keywords: string[];
}

function CollectionForm() {
  const { collectionId } = useParams();
  usePageTitle(`Edit collection ${collectionId}`);
  const { collection, state, reload } = useCollection(collectionId!);
  const { update, state: updateState } = useUpdateCollection();

  const { control, register, handleSubmit, formState: { errors } } = useForm<FormValues>({ values: collection });
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

        <Controller
          name="keywords"
          render={({ field }) => (
            <ArrayInput
              label="Keywords"
              error={errors.keywords}
              helper="Enter a comma-separated list of keywords."
              {...field}
            />
          )}
          control={control}
        />

        <Box mt="4">
          <Button type="submit" isLoading={updateState === "LOADING"}>Save collection</Button>
        </Box>
      </form>
    </>
  );
}

export default CollectionForm;
