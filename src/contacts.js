export async function getContacts(query) {
  try {
    const response = await fetch("https://reqres.in/api/users/");
    if (response.ok) {
      const data = await response.json();
      return data.data;
    } else {
      throw new Error("Failed to fetch contacts");
    }
  } catch (error) {
    throw error;
  }
}

export async function createContact() {
  try {
    const response = await fetch("https://reqres.in/api/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
      }),
    });

    if (response.ok) {
      const contact = await response.json();
      return contact;
    } else {
      throw new Error("Failed to create a new contact");
    }
  } catch (error) {
    throw error;
  }
}

export async function getContact(id) {
  try {
    const response = await fetch(`https://reqres.in/api/users/${id}`);
    if (response.ok) {
      const contact = await response.json();
      return contact;
    } else {
      throw new Error("Failed to fetch contact");
    }
  } catch (error) {
    throw error;
  }
}

export async function updateContact(id, updates) {
  try {
    const response = await fetch(`https://reqres.in/api/users/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updates),
    });

    if (response.ok) {
      const updatedContact = await response.json();
      return updatedContact;
    } else {
      throw new Error("Failed to update the contact");
    }
  } catch (error) {
    throw error;
  }
}

export async function deleteContact(id) {
  try {
    const response = await fetch(`https://reqres.in/api/users/${id}`, {
      method: "DELETE",
    });

    if (response.ok) {
      return true;
    } else {
      throw new Error("Failed to delete the contact");
    }
  } catch (error) {
    throw error;
  }
}