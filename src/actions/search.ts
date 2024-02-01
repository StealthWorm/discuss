'use server';

import paths from "@/paths";
import { redirect } from "next/navigation";

export async function search(formData: FormData) {
  const term = formData.get('term');

  if (typeof term !== 'string' || !term) {
    redirect(paths.home());
  }

  redirect(`/search?term=${term}`)
}