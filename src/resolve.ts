import axios from "axios";

export interface Manifest {
  [version: string]: {
    dependencies?: { [dep: string]: string };
    dist: { shasum: string; tarball: string };
  };
}

// This allows us use a custom npm registry.
const REGISTRY = process.env.REGISTRY || "https://registry.npmjs.org/";

/*
 * Use cache to prevent duplicated network request,
 * when asking the same package.
 */
const cache: { [dep: string]: Manifest } = Object.create(null);

export default async function (name: string): Promise<Manifest> {
  /*
   * If the requested package manifest is existed in cache,
   * just return it directly.
   */
  const cached = cache[name];
  if (cached) {
    return cached;
  }
  try {
    // Use axios to make the HTTP request
    const response = await axios.get(`${REGISTRY}${name}`);

    const json = response.data as { error: string } | { versions: Manifest };

    if ("error" in json) {
      throw new ReferenceError(`No such package: ${name}`);
    }

    // Add the manifest info to cache and return it.
    return (cache[name] = json.versions);
  } catch (error) {
    throw new Error(`Failed to fetch package: ${error}`);
  }
}
