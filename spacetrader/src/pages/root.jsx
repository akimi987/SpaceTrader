import React from "react";
import {
  Outlet,
  NavLink,
  useLoaderData,
  useNavigation,
  useSubmit,
  Form,
  redirect,
} from "react-router-dom";
import { useEffect } from "react";
import { getContacts, createContact } from "../kmdv/contact";

export async function action() {
  return redirect("/formulaire");
}

export async function loader({ request }) {
  const url = new URL(request.url);
  const q = url.searchParams.get("q");
  const contacts = await getContacts(q);
  return { contacts, q };
}

export default function Root() {
  const { contacts, q } = useLoaderData();
  const navigation = useNavigation();

  const userNames = contacts.map((contact) => {
    const firstName = contact.first_name || "";
    const lastName = contact.last_name || "";
    const userName = firstName + (firstName && lastName ? " " : "") + lastName;

    return userName || "No User Name";
  });

  return (
    <>
      <div
        id="detail"
        className={navigation.state === "loading" ? "loading" : ""}
      >
        <Outlet />
      </div>
    </>
  );
}