import { useParams } from "react-router-dom";
import { Heading } from "@chakra-ui/react";
import { useItem } from "@developmentseed/stac-react";
import { HeadingLead, Loading } from "../components";

function ItemForm () {
  const { collectionId, itemId } = useParams();
  const { item, state } = useItem(`http://localhost:8081/collections/${collectionId}/items/${itemId}`);

  return (
    <>
      {!item || state === "LOADING" ? (
        <Loading>Loading item...</Loading>
      ) : (
        <Heading as="h1">
          <HeadingLead>Edit Item</HeadingLead> {item.id}
        </Heading>
      )}
    </>
  );
}

export default ItemForm;
