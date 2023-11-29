import { StacProvider, Extents, StacAsset, StacLink } from "stac-ts";

export type FormValues = {
  id: string;
  stac_version: "1.0.0";
  type: "Collection";
  title: string;
  description: string;
  license: string;
  keywords: string[];
  providers: StacProvider[];
  assets: { [k: string]: StacAsset; };
  extent: Extents;
  links: StacLink[];
}
