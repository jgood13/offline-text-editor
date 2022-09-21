import { openDB } from "idb";

const initdb = async () =>
  // We are creating a new database named 'jate' which will be using version 1 of the database.
  openDB("jate", 1, {
    // Add our database schema if it has not already been initialized.
    upgrade(db) {
      if (db.objectStoreNames.contains("jate")) {
        console.log("jate database already exists");
        return;
      }
      // Create a new object store for the data and give it an key name of 'id' which needs to increment automatically.
      db.createObjectStore("jate", { keyPath: "id", autoIncrement: true });
      console.log("jate database created");
    },
  });

export const getDb = async () => {
  console.log("GET from the database");

  const jateDb = await openDB("jate", 1);

  // Create a new transaction and specify the database and data privileges.
  const tx = jateDb.transaction("jate", "readonly");

  // Open up the desired object store.
  const store = tx.objectStore("jate");

  // Use the .getAll() method to get all data in the database.
  const request = store.getAll();

  // Get confirmation of the request.
  const result = await request;
  result
    ? console.log("data saved", result.value)
    : console.log("data not found");
  return result?.value;
};

// Export a function we will use to update to the database.
export const putDb = async (id, content) => {
  console.log("PUT to the database");

  // Create a connection to the database database and version we want to use.
  const jateDb = await openDB("jate", 1);

  // Create a new transaction and specify the database and data privileges.
  const tx = jateDb.transaction("jate", "readwrite");

  // Open up the desired object store.
  const store = tx.objectStore("jate");

  // Use the put method on the store and pass in the content.
  const request = store.put({
    id: id,
    value: content,
  });

  // Get confirmation of the request.
  const result = await request;
  console.log("data saved to the database", result);
};

// Start the database.
initdb();
