import { useParams } from "react-router-dom";
import { Controller, useForm, useFieldArray } from "react-hook-form";
import { Box, Button, IconButton, Input, Table, Tbody, Td, Text, Th, Thead, Tr } from "@chakra-ui/react";
import { MdAdd, MdDelete } from "react-icons/md";
import { StacCollection } from "stac-ts";
import { useCollection } from "@developmentseed/stac-react";

import { FormValues } from "./types";
import useUpdateCollection from "./useUpdateCollection";
import { HeadingLead, Loading } from "../../components";
import { TextInput, TextAreaInput, ArrayInput, CheckboxField } from "../../components/forms";
import { usePageTitle } from "../../hooks";

function CollectionForm() {
  const { collectionId } = useParams();
  usePageTitle(`Edit collection ${collectionId}`);
  const { collection, state, reload } = useCollection(collectionId!); // eslint-disable-line @typescript-eslint/no-non-null-assertion
  const { update, state: updateState } = useUpdateCollection();

  const { control, register, handleSubmit, formState: { errors } } = useForm<FormValues>({ values: collection });
  const { fields, append, remove } = useFieldArray({ control, name: "providers" });
  const onSubmit = (data: StacCollection) => {
    update(data).then(reload);
  };

  if (!collection || state === "LOADING") {
    return <Loading>Loading collection...</Loading>;
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
          {...register("description", { required: "Enter a collection description."})}
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

        <fieldset>
          <legend>Providers</legend>

          <Table variant="simple" size="sm">
            <Thead>
              <Tr>
                <Th id="provider_name">Name</Th>
                <Th id="provider_description">Description</Th>
                <Th id="provider_roles">Roles</Th>
                <Th id="provider_url">URL</Th>
                <Th aria-label="Actions" />
              </Tr>
            </Thead>
            <Tbody>
              {fields.map(({ id }, idx: number) => (
                <Tr key={id}>
                  <Td>
                    <Input
                      {...register(`providers.${idx}.name`)}
                      aria-labelledby="provider_name"
                    />
                  </Td>
                  <Td>
                    <Input
                      {...register(`providers.${idx}.description`)}
                      aria-labelledby="provider_description"
                    />
                  </Td>
                  <Td>
                    <Controller
                      name={`providers.${idx}.roles`}
                      render={({ field }) => (
                        <CheckboxField
                          aria-labelledby="provider_roles"
                          options={[
                            { value: "licensor", label: "Licensor" },
                            { value: "producer", label: "Producer" },
                            { value: "processor", label: "Processor" },
                            { value: "host", label: "Host"}
                          ]}
                          {...field}
                        />
                      )}
                      control={control}
                    />
                  </Td>
                  <Td>
                    <Input
                      {...register(`providers.${idx}.url`)}
                      aria-labelledby="provider_url"
                    />
                  </Td>
                  <Td>
                    <IconButton
                      type="button"
                      size="sm"
                      icon={<MdDelete />}
                      onClick={() => remove(idx)}
                      aria-label="Remove provider"
                    />
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
          <Box textAlign="right" mt="2">
            <Button
              type="button"
              variant="link"
              leftIcon={<MdAdd />}
              onClick={() => append({ name: "" })}
            >
              Add provider
            </Button>
          </Box>
        </fieldset>

        <Box mt="4">
          <Button type="submit" isLoading={updateState === "LOADING"}>Save collection</Button>
        </Box>
      </form>
    </>
  );
}

export default CollectionForm;
