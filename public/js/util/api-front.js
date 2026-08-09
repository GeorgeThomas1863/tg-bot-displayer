export const sendToBack = async (inputParams) => {
  const { route } = inputParams;

  try {
    const res = await fetch(route, {
      method: "POST",
      body: JSON.stringify(inputParams),
      headers: {
        "Content-Type": "application/json",
      },
    });

    let data;
    try {
      data = await res.json();
    } catch (error) {
      console.log("BACKEND RESPONSE JSON ERROR:", error);
      return { error: `${res.status} ${res.statusText}` };
    }

    if (!res.ok) {
      return data?.error ? data : { error: `${res.status} ${res.statusText}` };
    }

    return data;
  } catch (error) {
    console.log("BACKEND REQUEST ERROR:", error);
    return { error: error?.message || String(error) };
  }
};
