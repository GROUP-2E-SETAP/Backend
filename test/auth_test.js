
async function testSignup() {
  const signupData = {
    name: "test",
    email: "ting@example.com",
    password: "StrongPass123!"
  };

  try {
    const res = await fetch("http://localhost:3000/api/v1/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(signupData)
    });

    console.log("HTTP status:", res.status);
    const data = await res.json();
    console.log("Response body:", data);

  } catch (err) {
    console.error("Fetch failed:", err.message);
  }
}

testSignup();
